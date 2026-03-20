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

"""Research sub-agents for different search verticals.

Each sub-agent specializes in searching a specific source (contacts, calendar,
documents, web) and returning structured findings.
"""

from google.adk.agents.llm_agent import LlmAgent
from tools import search_contacts, search_calendar, search_documents, search_web


calendar_agent = LlmAgent(
    name="calendar_researcher",
    model="gemini-2.0-flash",
    instruction="""You are a calendar search specialist. Your job is to find meetings
matching the user's query.

When searching:
1. Extract date ranges, attendees, and topics from the context
2. Call search_calendar with appropriate filters
3. Return the results — the orchestrator will handle disambiguation

Use the known_facts from state to inform your search. If a contact was already
identified, use their name as an attendee filter.

After searching, transfer back to the orchestrator with transfer_to_agent("research_orchestrator").""",
    tools=[search_calendar],
)

contacts_agent = LlmAgent(
    name="contacts_researcher",
    model="gemini-2.0-flash",
    instruction="""You are a contacts/directory search specialist. Your job is to find
people matching the user's description.

When searching:
1. Extract name fragments, locations, teams, or roles from the context
2. Call search_contacts with appropriate filters
3. Return the results — the orchestrator will handle disambiguation

Focus on the most distinguishing features mentioned (location, team, role).

After searching, transfer back to the orchestrator with transfer_to_agent("research_orchestrator").""",
    tools=[search_contacts],
)

documents_agent = LlmAgent(
    name="documents_researcher",
    model="gemini-2.0-flash",
    instruction="""You are a document search specialist. Your job is to find documents,
proposals, RFCs, and emails matching the user's query.

When searching:
1. Extract keywords, authors, document types, and date ranges from the context
2. Call search_documents with appropriate filters
3. Return the results — the orchestrator will handle disambiguation

If a specific person was already identified, use their name as an author filter.

After searching, transfer back to the orchestrator with transfer_to_agent("research_orchestrator").""",
    tools=[search_documents],
)

web_agent = LlmAgent(
    name="web_researcher",
    model="gemini-2.0-flash",
    instruction="""You are a web search specialist. You're the fallback when internal
sources (contacts, calendar, documents) don't have what we need.

Only search the web when:
1. Internal sources returned no results
2. The query is about external information (company info, public data)
3. The orchestrator explicitly asks for a web search

After searching, transfer back to the orchestrator with transfer_to_agent("research_orchestrator").""",
    tools=[search_web],
)

# All sub-agents available for the orchestrator
ALL_RESEARCH_AGENTS = [
    calendar_agent,
    contacts_agent,
    documents_agent,
    web_agent,
]
