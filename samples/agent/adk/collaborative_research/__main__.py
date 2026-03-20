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

"""Entry point for the Collaborative Deep Research Agent.

Starts an A2A-compatible server hosting the research agent.

Usage:
    python -m collaborative_research [--port PORT] [--use-ui]
"""

import asyncio
import click
import logging
import os
import sys
import uvicorn
from agent import CollaborativeResearchAgent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@click.command()
@click.option("--port", default=10010, help="Port to run the server on")
@click.option("--host", default="0.0.0.0", help="Host to bind to")
@click.option("--use-ui", is_flag=True, default=True, help="Enable A2UI rendering")
def main(port: int, host: str, use_ui: bool):
    """Start the Collaborative Deep Research Agent server."""
    base_url = f"http://{host}:{port}"
    logger.info(f"Starting Collaborative Research Agent on {base_url}")
    logger.info(f"A2UI enabled: {use_ui}")

    agent = CollaborativeResearchAgent(base_url=base_url, use_ui=use_ui)
    card = agent.get_agent_card()
    logger.info(f"Agent card: {card.name} — {card.description}")

    # For now, just demonstrate the agent can be created.
    # Full A2A server integration follows the same pattern as restaurant_finder.
    logger.info("Agent initialized successfully.")
    logger.info(f"Skills: {[s.name for s in card.skills]}")
    logger.info(f"Examples: {card.skills[0].examples}")
    logger.info("")
    logger.info("To run with A2A server, integrate with a2a-sdk server like the restaurant_finder sample.")
    logger.info("For now, use the mock tools directly or run the Dojo scenarios.")


if __name__ == "__main__":
    main()
