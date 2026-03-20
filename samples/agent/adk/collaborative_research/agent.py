# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Collaborative Deep Research Agent — Orchestrator.

A research agent that handles ambiguous, recall-based queries by:
1. Parsing what the user knows vs. what's unclear
2. Dispatching parallel searches across contacts, calendar, documents
3. Building an evolving A2UI artifact as findings come in
4. Asking clarifying questions only when search can't resolve ambiguity
"""

import json
import logging
import os
from collections.abc import AsyncIterable
from typing import Any

from a2a.types import (
    AgentCapabilities,
    AgentCard,
    AgentSkill,
    DataPart,
    Part,
    TextPart,
)
from google.adk.agents.llm_agent import LlmAgent
from google.adk.artifacts import InMemoryArtifactService
from google.adk.memory.in_memory_memory_service import InMemoryMemoryService
from google.adk.models.lite_llm import LiteLlm
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

from a2ui.core.schema.constants import VERSION_0_8, A2UI_OPEN_TAG, A2UI_CLOSE_TAG
from a2ui.core.schema.manager import A2uiSchemaManager
from a2ui.core.parser.parser import parse_response, ResponsePart
from a2ui.basic_catalog.provider import BasicCatalog
from a2ui.core.schema.common_modifiers import remove_strict_validation
from a2ui.a2a import create_a2ui_part, get_a2ui_agent_extension, parse_response_to_parts

from a2ui_prompts import (
    ROLE_DESCRIPTION,
    UI_DESCRIPTION,
    WORKFLOW_DESCRIPTION,
    get_text_prompt,
    get_schema_manager,
)
from research_agents import ALL_RESEARCH_AGENTS
from tools import (
    search_contacts,
    search_calendar,
    search_documents,
    search_web,
    update_research_artifact,
)

logger = logging.getLogger(__name__)


class CollaborativeResearchAgent:
    """An agent that performs collaborative deep research on ambiguous queries.

    Uses multiple sub-agents to search different sources in parallel,
    building an evolving A2UI artifact as findings come in.
    """

    SUPPORTED_CONTENT_TYPES = ["text", "text/plain"]

    def __init__(self, base_url: str, use_ui: bool = False):
        self.base_url = base_url
        self.use_ui = use_ui
        self._schema_manager = get_schema_manager() if use_ui else None
        self._agent = self._build_agent(use_ui)
        self._user_id = "remote_agent"
        self._runner = Runner(
            app_name=self._agent.name,
            agent=self._agent,
            artifact_service=InMemoryArtifactService(),
            session_service=InMemorySessionService(),
            memory_service=InMemoryMemoryService(),
        )

    def get_agent_card(self) -> AgentCard:
        capabilities = AgentCapabilities(
            streaming=True,
            extensions=[
                get_a2ui_agent_extension(
                    self._schema_manager.accepts_inline_catalogs if self._schema_manager else False,
                    self._schema_manager.supported_catalog_ids if self._schema_manager else [],
                )
            ] if self.use_ui else [],
        )
        skill = AgentSkill(
            id="collaborative_research",
            name="Collaborative Deep Research",
            description=(
                "Helps find information from ambiguous, recall-based queries. "
                "Searches contacts, calendar, documents, and web to build a "
                "structured answer collaboratively with the user."
            ),
            tags=["research", "search", "contacts", "calendar", "documents", "recall"],
            examples=[
                "That meeting I had about payments with a guy from Austin — what was his name?",
                "Find the proposal Sarah sent about the Q3 budget thing",
                "What was the doc about the API redesign from last month?",
                "Who was that person from the security team I met at the offsite?",
            ],
        )
        return AgentCard(
            name="Collaborative Research Agent",
            description=(
                "A research agent that handles ambiguous queries by searching "
                "multiple sources and building answers collaboratively."
            ),
            url=self.base_url,
            version="0.1.0",
            default_input_modes=self.SUPPORTED_CONTENT_TYPES,
            default_output_modes=self.SUPPORTED_CONTENT_TYPES,
            capabilities=capabilities,
            skills=[skill],
        )

    def get_processing_message(self) -> str:
        return "🔍 Researching... Searching contacts, calendar, and documents."

    def _build_agent(self, use_ui: bool) -> LlmAgent:
        """Build the orchestrator agent with sub-agents."""
        if use_ui and self._schema_manager:
            system_prompt = self._schema_manager.generate_system_prompt(
                role_description=ROLE_DESCRIPTION,
                ui_description=UI_DESCRIPTION,
                include_schema=True,
                include_examples=True,
                validate_examples=True,
            )
        else:
            system_prompt = get_text_prompt()

        # The orchestrator has direct access to all search tools
        # (rather than transferring to sub-agents) for simpler parallel execution
        orchestrator = LlmAgent(
            name="research_orchestrator",
            model=LiteLlm(model=os.environ.get("MODEL", "gemini-2.0-flash")),
            instruction=system_prompt,
            tools=[
                search_contacts,
                search_calendar,
                search_documents,
                search_web,
                update_research_artifact,
            ],
            sub_agents=ALL_RESEARCH_AGENTS,
        )
        return orchestrator

    async def stream(
        self, query: str, session_id: str
    ) -> AsyncIterable[dict[str, Any]]:
        """Stream research results as they come in."""
        session = await self._runner.session_service.get_session(
            app_name=self._agent.name,
            user_id=self._user_id,
            session_id=session_id,
        )
        if session is None:
            session = await self._runner.session_service.create_session(
                app_name=self._agent.name,
                user_id=self._user_id,
                session_id=session_id,
            )

        message = types.Content(
            role="user", parts=[types.Part.from_text(text=query)]
        )

        async for event in self._runner.run_async(
            user_id=self._user_id,
            session_id=session.id,
            new_message=message,
        ):
            if event.content and event.content.parts:
                for part in event.content.parts:
                    if hasattr(part, "text") and part.text:
                        yield {"type": "text", "content": part.text}

    async def invoke(self, query: str, session_id: str) -> list[Part]:
        """Invoke the agent and return A2A-compatible parts."""
        session = await self._runner.session_service.get_session(
            app_name=self._agent.name,
            user_id=self._user_id,
            session_id=session_id,
        )
        if session is None:
            session = await self._runner.session_service.create_session(
                app_name=self._agent.name,
                user_id=self._user_id,
                session_id=session_id,
            )

        message = types.Content(
            role="user", parts=[types.Part.from_text(text=query)]
        )

        result_parts: list[Part] = []
        async for event in self._runner.run_async(
            user_id=self._user_id,
            session_id=session.id,
            new_message=message,
        ):
            if event.content and event.content.parts:
                for part in event.content.parts:
                    if hasattr(part, "text") and part.text:
                        if self.use_ui and self._schema_manager:
                            parsed = parse_response_to_parts(part.text)
                            result_parts.extend(parsed)
                        else:
                            result_parts.append(TextPart(text=part.text))

        return result_parts
