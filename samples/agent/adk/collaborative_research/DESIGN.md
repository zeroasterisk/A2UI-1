# Collaborative Deep Research Agent — Design Document

## Overview

A research agent that handles **ambiguous, recall-based queries** — the kind humans actually ask:
- *"That meeting I had about payments with a guy from Austin — what was his name?"*
- *"What was the proposal Sarah sent about the Q3 budget thing?"*
- *"Find the doc about the new API design — I think it was from last month"*

The core insight: **research is collaborative**. The user gives fragments. The agent shows what it understood, what's still ambiguous, and searches in parallel — building a structured artifact that evolves as facts come in. The UI is the collaboration surface, not just a display.

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                   User (A2UI Client)                  │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │ Chat +    │  │ Clarification│  │ Research        │ │
│  │ Artifact  │  │ Surface      │  │ Status Surface  │ │
│  └─────┬────┘  └──────┬───────┘  └───────┬────────┘ │
│        │               │                  │           │
│        └───────── clientEvent ────────────┘           │
└──────────────────────┬───────────────────────────────┘
                       │ A2A / A2UI messages
                       ▼
┌──────────────────────────────────────────────────────┐
│              Orchestrator Agent (LlmAgent)             │
│                                                        │
│  • Maintains "Known Facts" vs "Open Questions"         │
│  • Decides: clarify? search? refine artifact?          │
│  • Manages conversation + surfaces                     │
│  • Delegates to sub-agents via transfer                │
│                                                        │
│  State:                                                │
│  ┌─────────────────────────────────────────────┐      │
│  │ known_facts: [{fact, confidence, source}]    │      │
│  │ open_questions: [{question, options}]        │      │
│  │ hypotheses: [{description, confidence}]      │      │
│  │ artifact: {type, fields, version}            │      │
│  │ search_status: {agent: status}               │      │
│  └─────────────────────────────────────────────┘      │
│                                                        │
│  Sub-agents (parallel research workers):               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Calendar │ │ Contacts │ │ Documents│ │ Web      │ │
│  │ Agent    │ │ Agent    │ │ Agent    │ │ Agent    │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                        │
│  Artifact Agent:                                       │
│  ┌──────────────────────────────────────┐             │
│  │ Merges findings → structured output  │             │
│  │ Contact card / Meeting summary / Doc │             │
│  └──────────────────────────────────────┘             │
└──────────────────────────────────────────────────────┘
```

### Orchestrator Agent

The brain. An `LlmAgent` that:

1. **Parses the ambiguous query** — extracts known facts (entities, dates, topics) and identifies gaps
2. **Decides the next action:**
   - If critical info is missing → ask a clarifying question via A2UI
   - If enough to search → dispatch sub-agents in parallel
   - If results are in → update the artifact
3. **Maintains state** in `ToolContext.state`:
   - `known_facts` — confirmed pieces of info with confidence scores
   - `open_questions` — what we still need to know
   - `hypotheses` — working theories (e.g., "the person might be John from FinTech team")
   - `artifact` — the evolving structured result
   - `search_status` — which sub-agents are running/done

The orchestrator's system instruction emphasizes:
- **Don't ask what you can search** — if "guy from Austin" + "payments meeting" is enough to search contacts + calendar, do it before asking
- **Show your work** — always surface what you understood and what you're doing
- **Progressive refinement** — don't wait for all results; update the UI as each arrives

### Research Sub-Agents

Each is a specialized `LlmAgent` with domain-specific tools:

| Agent | Tools | Searches for |
|-------|-------|-------------|
| **CalendarAgent** | `search_calendar` | Meetings matching time/topic/attendees |
| **ContactsAgent** | `search_contacts` | People matching name/location/role |
| **DocumentsAgent** | `search_documents` | Docs/emails matching keywords/authors |
| **WebAgent** | `web_search` | External info when internal sources fail |

Sub-agents return structured findings:
```python
{
  "source": "calendar",
  "confidence": 0.85,
  "findings": [
    {"type": "meeting", "title": "Payments Integration Review", "date": "2026-02-15",
     "attendees": ["you", "Marcus Chen (Austin)"], "notes": "Discussed Stripe migration..."}
  ]
}
```

### Artifact Agent

Synthesizes findings into a structured result. Different artifact types:

- **Contact Card** — name, role, email, phone, recent interactions
- **Meeting Summary** — title, date, attendees, key points, action items
- **Document Reference** — title, author, date, summary, link
- **Research Brief** — multi-source synthesis with citations

The artifact agent receives findings from sub-agents and decides:
- What to include (high confidence)
- What to mark as uncertain (medium confidence)
- What to flag for user confirmation

---

## A2UI Integration

### Surface Architecture

The agent manages **three A2UI surfaces** simultaneously:

#### 1. Main Artifact Surface (`research-artifact`)

The primary deliverable — evolves as research progresses.

```
┌─────────────────────────────────────────┐
│ 🔍 Research: "payments meeting, Austin" │
│─────────────────────────────────────────│
│                                         │
│ 👤 Marcus Chen                          │
│    Senior Engineer, FinTech Team        │
│    📍 Austin, TX                        │
│    ✉️ m.chen@company.com               │
│    📅 Last meeting: Feb 15, 2026        │
│                                         │
│ 📋 Meeting: Payments Integration Review │
│    Feb 15, 2:00 PM — 3:00 PM           │
│    Attendees: You, Marcus, Sarah L.     │
│    Key topic: Stripe migration timeline │
│                                         │
│ [📌 Pin] [🔍 More details] [📧 Email]  │
└─────────────────────────────────────────┘
```

Implemented as a `Column` with `Card` children, data-bound to the artifact model.

#### 2. Clarification Surface (`research-clarification`)

Interactive disambiguation when the agent needs input:

```
┌─────────────────────────────────────────┐
│ I found multiple matches. Help me       │
│ narrow it down:                         │
│                                         │
│ Which meeting about payments?           │
│ ┌─────────────────────────────────┐     │
│ │ 📅 Payments Integration Review  │     │
│ │    Feb 15 — with Marcus Chen    │     │
│ │    [This one]                   │     │
│ ├─────────────────────────────────┤     │
│ │ 📅 Q3 Payment Gateway Planning  │     │
│ │    Feb 22 — with Priya Sharma   │     │
│ │    [This one]                   │     │
│ ├─────────────────────────────────┤     │
│ │ 📅 Payment Fraud Review         │     │
│ │    Mar 1 — with Alex Torres     │     │
│ │    [This one]                   │     │
│ └─────────────────────────────────┘     │
│                                         │
│ [None of these] [Search more broadly]   │
└─────────────────────────────────────────┘
```

Uses `Button` components with `clientEvent` to capture selections without requiring text input.

#### 3. Research Status Surface (`research-status`)

Live progress indicators for background searches:

```
┌─────────────────────────────────────────┐
│ 🔎 Searching...                         │
│                                         │
│ ✅ Contacts — Found 1 match             │
│ ⏳ Calendar — Scanning Feb-Mar 2026...  │
│ ⏳ Documents — Searching "payments"...  │
│ ⬚ Web — Queued                          │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━▪━━━━━━━━━━━━━━ │
│ 2 of 4 sources checked                  │
└─────────────────────────────────────────┘
```

### A2UI Message Flow

```
User: "that meeting about payments with a guy from Austin"

→ Agent sends:
  1. beginRendering(surfaceId="research-status")    — show search status
  2. surfaceUpdate("research-status", components=[status indicators])
  3. dataModelUpdate("research-status", {sources: [{name: "Contacts", status: "searching"}...]})

→ ContactsAgent finds Marcus Chen:
  4. dataModelUpdate("research-status", {sources: [{name: "Contacts", status: "done", count: 1}...]})
  5. beginRendering(surfaceId="research-artifact")  — start building artifact
  6. surfaceUpdate("research-artifact", components=[contact card layout])
  7. dataModelUpdate("research-artifact", {name: "Marcus Chen", title: "Senior Engineer"...})

→ CalendarAgent finds 3 meetings:
  8. dataModelUpdate("research-status", {sources: [{name: "Calendar", status: "done", count: 3}...]})
  9. beginRendering(surfaceId="research-clarification")  — need to disambiguate
  10. surfaceUpdate("research-clarification", components=[meeting choice buttons])
  11. dataModelUpdate("research-clarification", {meetings: [...]})

→ User clicks "Payments Integration Review":
  12. clientEvent({surfaceId: "research-clarification", eventId: "select-meeting", data: {meetingId: "m1"}})

→ Agent updates artifact:
  13. dataModelUpdate("research-artifact", {meeting: {title: "Payments Integration Review"...}})
  14. surfaceUpdate("research-artifact", components=[expanded with meeting details])
```

### clientEvent Usage

User interactions that refine the research:

| Event | Trigger | Effect |
|-------|---------|--------|
| `select-hypothesis` | Click a disambiguating option | Narrows search, updates artifact |
| `reject-hypothesis` | Click "Not this" | Removes candidate, may trigger new search |
| `pin-fact` | Click 📌 on a fact | Marks as confirmed, stops re-searching |
| `expand-detail` | Click "More details" on a section | Triggers deeper research on that aspect |
| `refine-query` | Submit text in refinement field | Adds new constraints to search |

---

## ADK Architecture

### Agent Graph

```python
# Orchestrator is the root agent with sub-agents
orchestrator = LlmAgent(
    name="research_orchestrator",
    model="gemini-2.0-flash",
    instruction=ORCHESTRATOR_INSTRUCTION,
    sub_agents=[
        calendar_agent,
        contacts_agent,
        documents_agent,
        web_agent,
        artifact_agent,
    ],
    tools=[
        parse_query,        # Extract entities/intent from ambiguous input
        update_artifact,    # Modify the research artifact
        send_clarification, # Present disambiguation UI
        send_status,        # Update search status surface
    ],
)
```

### State Management via ToolContext

All agents share state through `ToolContext.state`:

```python
# In tools.py
def parse_query(query: str, tool_context: ToolContext) -> str:
    """Parse an ambiguous query into known facts and open questions."""
    # LLM extracts structured info
    parsed = {
        "known_facts": [
            {"entity": "meeting", "topic": "payments", "confidence": 0.9},
            {"entity": "person", "location": "Austin", "confidence": 0.8},
        ],
        "open_questions": [
            {"question": "Which specific meeting?", "type": "disambiguation"},
            {"question": "Person's name?", "type": "identification"},
        ],
    }
    tool_context.state["known_facts"] = parsed["known_facts"]
    tool_context.state["open_questions"] = parsed["open_questions"]
    return json.dumps(parsed)
```

### Streaming Updates

The agent uses ADK's streaming mode to push A2UI updates as research happens:

```python
runner = Runner(
    app_name="collaborative_research",
    agent=orchestrator,
    session_service=InMemorySessionService(),
    artifact_service=InMemoryArtifactService(),
    memory_service=InMemoryMemoryService(),
)

# Stream events as they happen
async for event in runner.run_async(
    user_id=user_id, session_id=session_id, new_message=message
):
    if event.content:
        # Parse A2UI from response, emit surface updates
        yield event
```

### Multi-Agent Coordination

The orchestrator uses ADK's `transfer_to_agent` pattern:

1. Orchestrator parses query → updates state with known facts
2. Orchestrator transfers to relevant sub-agents
3. Sub-agents search, write findings to `tool_context.state["findings"]`
4. Control returns to orchestrator
5. Orchestrator reads findings, updates artifact surface, decides next step

For parallel execution, the orchestrator can dispatch multiple sub-agents:

```python
# Orchestrator instruction includes:
# "When you have enough info to search, transfer to the appropriate
#  research agents. You may transfer to multiple agents in sequence.
#  After each returns, check if we have enough to build the artifact."
```

---

## Key UX Flows

### Flow 1: Ambiguous Query → Clarification → Result

```
User: "that meeting about payments with a guy from Austin"

1. Orchestrator:
   - Extracts: topic=payments, person_location=Austin, type=meeting
   - Missing: person_name, date_range, specific_meeting
   - Decision: enough to search contacts + calendar simultaneously

2. Status surface appears:
   [Contacts: searching...] [Calendar: searching...] [Docs: queued]

3. Contacts agent finds: Marcus Chen (Austin, FinTech)
   → Artifact surface begins: shows contact card for Marcus

4. Calendar agent finds: 3 meetings with "payments" + Marcus
   → Clarification surface: "Which meeting?"
   → Shows 3 options with dates and brief descriptions

5. User clicks: "Payments Integration Review — Feb 15"
   → Clarification surface dismissed
   → Artifact updates with full meeting details

6. Final artifact: Contact card + Meeting summary + Action items
```

### Flow 2: Progressive Artifact Building

```
User: "find the proposal Sarah sent about Q3 budget"

1. Search contacts → Sarah Lee (Finance), Sarah Kim (Ops)
   → Clarification: "Which Sarah?"
   
2. User: "Finance Sarah"
   → Pin: Sarah Lee

3. Search docs for "Q3 budget" by Sarah Lee
   → Document found: "Q3 Budget Reallocation Proposal"
   → Artifact: Document card with summary

4. User: "Tell me more about the timeline section"
   → Agent drills into document
   → Artifact expands with timeline details
```

### Flow 3: Dead End → Broader Search

```
User: "that thing Dave mentioned about the API redesign"

1. Search contacts → 4 people named Dave
   → Clarification: "Which Dave?"
   
2. User: "I'm not sure, it was in a meeting last week"

3. Search calendar for past week → 12 meetings
   → Filter for attendees named Dave → 2 meetings
   → Clarification: "Was it one of these?"

4. User clicks meeting → Dave Rodriguez
   → Search docs/messages for API redesign from Dave R.
   → Artifact builds with findings
```

---

## A2UI Component Patterns

### Artifact Card (Reusable Pattern)

```json
{
  "id": "artifact-card",
  "component": {
    "Card": {
      "children": {"explicitList": ["artifact-header", "artifact-content", "artifact-actions"]},
      "elevation": 2
    }
  }
}
```

### Hypothesis List (Disambiguation)

```json
{
  "id": "hypothesis-list",
  "component": {
    "List": {
      "children": {"path": "/hypotheses"},
      "itemTemplate": "hypothesis-item"
    }
  }
}
```

### Status Row

```json
{
  "id": "status-row",
  "component": {
    "Row": {
      "children": {"explicitList": ["status-icon", "status-label", "status-detail"]},
      "alignment": "center"
    }
  }
}
```

---

## Data Model

### Research Artifact Model

```json
{
  "query": "that meeting about payments with a guy from Austin",
  "status": "in_progress",
  "artifact_type": "meeting_and_contact",
  "contact": {
    "name": "Marcus Chen",
    "title": "Senior Engineer",
    "team": "FinTech",
    "location": "Austin, TX",
    "email": "m.chen@company.com",
    "imageUrl": "https://example.com/marcus.jpg",
    "confidence": 0.95
  },
  "meeting": {
    "title": "Payments Integration Review",
    "date": "2026-02-15",
    "time": "2:00 PM - 3:00 PM",
    "attendees": ["You", "Marcus Chen", "Sarah Lee"],
    "keyPoints": [
      "Stripe migration timeline: Q3 2026",
      "PCI compliance requirements reviewed",
      "Action: Marcus to send API specs by Feb 20"
    ],
    "confidence": 0.9
  },
  "sources_checked": {
    "contacts": {"status": "done", "results": 1},
    "calendar": {"status": "done", "results": 3},
    "documents": {"status": "done", "results": 0},
    "web": {"status": "skipped"}
  }
}
```

---

## Implementation Notes

### Mock Data Strategy

The prototype uses mock tools that return realistic data:
- **Calendar**: 5-10 meetings over a date range with attendees and topics
- **Contacts**: ~20 people with varied locations, roles, teams
- **Documents**: ~15 docs/emails with authors, dates, summaries
- **Web**: Falls back to basic search results

This makes the A2UI scenarios realistic while keeping the sample self-contained.

### Error Handling

- Sub-agent timeout → status shows "timed out", orchestrator continues with available results
- No results found → artifact shows "No matches" with suggestions to broaden search
- All sub-agents fail → graceful degradation to text-only response

### ADK Issues to File

1. **Parallel sub-agent execution** — ADK currently handles sub-agents sequentially via `transfer_to_agent`. True parallel execution would require running sub-agents as separate tasks. For this sample, we simulate parallelism by calling tools directly rather than transferring.

2. **Multi-surface streaming** — A2UI supports multiple surfaces, but streaming updates to multiple surfaces simultaneously requires careful ordering. The agent must track which surface to update and emit A2UI blocks in the right order.

3. **clientEvent routing** — When a user interacts with a clarification button, the `clientEvent` needs to reach the orchestrator's next turn. ADK doesn't have a built-in mechanism for this; we handle it by checking `tool_context.state` for pending client events at the start of each turn.

4. **State size limits** — As the artifact grows with findings from multiple sources, `tool_context.state` can get large. ADK should consider state compaction or pagination for long-running research sessions.

---

## File Structure

```
collaborative_research/
├── DESIGN.md              # This file
├── __init__.py
├── __main__.py            # Entry point (A2A server)
├── agent.py               # Orchestrator + agent card
├── research_agents.py     # Sub-agents for each search vertical
├── tools.py               # Mock tools (search, calendar, contacts, docs)
├── a2ui_prompts.py        # A2UI prompt templates + schema config
├── mock_data.py           # Realistic mock data
├── pyproject.toml         # Dependencies
└── examples/
    ├── ambiguous_query.json        # Dojo scenario: disambiguation flow
    └── progressive_research.json   # Dojo scenario: progressive artifact building
```

---

## Future Directions

- **Real tool integrations** — Replace mocks with Google Calendar API, Google Contacts, Google Drive search
- **Memory integration** — Use ADK's memory service to remember past research sessions
- **Confidence visualization** — Show confidence levels visually (progress bars, color coding)
- **Collaborative refinement** — Multiple users contributing facts to the same research
- **Voice input** — Handle spoken ambiguous queries with speech-to-text artifacts
