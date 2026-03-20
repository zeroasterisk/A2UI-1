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

"""Mock tools for the collaborative research agent.

Each tool simulates a search vertical (contacts, calendar, documents, web)
and returns realistic results based on the mock data.
"""

import json
import logging
from typing import Any

from google.adk.tools.tool_context import ToolContext
from mock_data import CONTACTS, MEETINGS, DOCUMENTS

logger = logging.getLogger(__name__)


def search_contacts(
    query: str,
    tool_context: ToolContext,
    name: str = "",
    location: str = "",
    team: str = "",
) -> str:
    """Search the company directory for contacts matching the given criteria.

    Args:
        query: Free-text search query (e.g., "guy from Austin in payments")
        name: Optional name filter (partial match)
        location: Optional location filter (e.g., "Austin")
        team: Optional team filter (e.g., "FinTech")
    """
    logger.info(f"--- TOOL: search_contacts(query={query}, name={name}, location={location}, team={team}) ---")

    results = []
    query_lower = query.lower()

    for contact in CONTACTS:
        score = 0
        # Name match
        if name and name.lower() in contact["name"].lower():
            score += 3
        # Location match
        if location and location.lower() in contact["location"].lower():
            score += 2
        # Team match
        if team and team.lower() in contact["team"].lower():
            score += 2
        # Free-text match against all fields
        searchable = " ".join([
            contact["name"], contact["title"], contact["team"],
            contact["location"], " ".join(contact["recentInteractions"]),
        ]).lower()
        for word in query_lower.split():
            if word in searchable:
                score += 1

        if score > 0:
            results.append({**contact, "_score": score})

    results.sort(key=lambda x: x["_score"], reverse=True)
    # Remove internal score
    for r in results:
        del r["_score"]

    # Update state with search status
    sources = tool_context.state.get("sources_checked", {})
    sources["contacts"] = {"status": "done", "count": len(results)}
    tool_context.state["sources_checked"] = sources

    if results:
        tool_context.state.setdefault("findings", []).append({
            "source": "contacts",
            "type": "contacts",
            "data": results,
        })

    logger.info(f"  → Found {len(results)} contacts")
    return json.dumps({"source": "contacts", "count": len(results), "results": results})


def search_calendar(
    query: str,
    tool_context: ToolContext,
    date_from: str = "",
    date_to: str = "",
    attendee: str = "",
) -> str:
    """Search calendar for meetings matching the given criteria.

    Args:
        query: Free-text search query (e.g., "payments meeting")
        date_from: Optional start date filter (YYYY-MM-DD)
        date_to: Optional end date filter (YYYY-MM-DD)
        attendee: Optional attendee name filter
    """
    logger.info(f"--- TOOL: search_calendar(query={query}, attendee={attendee}) ---")

    results = []
    query_lower = query.lower()

    for meeting in MEETINGS:
        score = 0
        # Attendee match
        if attendee:
            for att in meeting["attendees"]:
                if attendee.lower() in att.lower():
                    score += 3
                    break
        # Date range match
        if date_from and meeting["date"] >= date_from:
            score += 1
        if date_to and meeting["date"] <= date_to:
            score += 1
        # Topic/keyword match
        searchable = " ".join([
            meeting["title"], meeting["notes"],
            " ".join(meeting["topics"]), " ".join(meeting["attendees"]),
        ]).lower()
        for word in query_lower.split():
            if word in searchable:
                score += 1

        if score > 0:
            results.append({**meeting, "_score": score})

    results.sort(key=lambda x: x["_score"], reverse=True)
    for r in results:
        del r["_score"]

    sources = tool_context.state.get("sources_checked", {})
    sources["calendar"] = {"status": "done", "count": len(results)}
    tool_context.state["sources_checked"] = sources

    if results:
        tool_context.state.setdefault("findings", []).append({
            "source": "calendar",
            "type": "meetings",
            "data": results,
        })

    logger.info(f"  → Found {len(results)} meetings")
    return json.dumps({"source": "calendar", "count": len(results), "results": results})


def search_documents(
    query: str,
    tool_context: ToolContext,
    author: str = "",
    doc_type: str = "",
    date_from: str = "",
) -> str:
    """Search documents, emails, and files matching the given criteria.

    Args:
        query: Free-text search query (e.g., "Q3 budget proposal")
        author: Optional author name filter
        doc_type: Optional document type filter (e.g., "proposal", "RFC", "technical")
        date_from: Optional start date filter (YYYY-MM-DD)
    """
    logger.info(f"--- TOOL: search_documents(query={query}, author={author}) ---")

    results = []
    query_lower = query.lower()

    for doc in DOCUMENTS:
        score = 0
        # Author match
        if author and author.lower() in doc["author"].lower():
            score += 3
        # Type match
        if doc_type and doc_type.lower() == doc["type"].lower():
            score += 2
        # Date filter
        if date_from and doc["date"] >= date_from:
            score += 1
        # Free-text match
        searchable = " ".join([
            doc["title"], doc["author"], doc["summary"],
            " ".join(doc["tags"]),
        ]).lower()
        for word in query_lower.split():
            if word in searchable:
                score += 1

        if score > 0:
            results.append({**doc, "_score": score})

    results.sort(key=lambda x: x["_score"], reverse=True)
    for r in results:
        del r["_score"]

    sources = tool_context.state.get("sources_checked", {})
    sources["documents"] = {"status": "done", "count": len(results)}
    tool_context.state["sources_checked"] = sources

    if results:
        tool_context.state.setdefault("findings", []).append({
            "source": "documents",
            "type": "documents",
            "data": results,
        })

    logger.info(f"  → Found {len(results)} documents")
    return json.dumps({"source": "documents", "count": len(results), "results": results})


def search_web(query: str, tool_context: ToolContext) -> str:
    """Search the web for information when internal sources don't have answers.

    Args:
        query: Search query string
    """
    logger.info(f"--- TOOL: search_web(query={query}) ---")

    # Mock web results — used as fallback
    results = [
        {
            "title": f"Search result for: {query}",
            "url": f"https://example.com/search?q={query.replace(' ', '+')}",
            "snippet": f"Web search results for '{query}'. This is a mock result for demonstration purposes.",
        }
    ]

    sources = tool_context.state.get("sources_checked", {})
    sources["web"] = {"status": "done", "count": len(results)}
    tool_context.state["sources_checked"] = sources

    logger.info(f"  → Found {len(results)} web results")
    return json.dumps({"source": "web", "count": len(results), "results": results})


def update_research_artifact(
    artifact_type: str,
    content: str,
    tool_context: ToolContext,
) -> str:
    """Update the research artifact with new findings.

    Args:
        artifact_type: Type of artifact ("contact_card", "meeting_summary", "document_reference", "research_brief")
        content: JSON string of the artifact content to merge
    """
    logger.info(f"--- TOOL: update_research_artifact(type={artifact_type}) ---")

    try:
        new_content = json.loads(content)
    except json.JSONDecodeError:
        new_content = {"raw": content}

    artifact = tool_context.state.get("artifact", {})
    artifact["type"] = artifact_type
    artifact["version"] = artifact.get("version", 0) + 1

    # Merge new content into existing artifact
    if "fields" not in artifact:
        artifact["fields"] = {}
    artifact["fields"].update(new_content)

    tool_context.state["artifact"] = artifact

    logger.info(f"  → Artifact updated to v{artifact['version']}")
    return json.dumps({"status": "updated", "artifact": artifact})
