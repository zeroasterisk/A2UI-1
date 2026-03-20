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

"""A2UI prompt templates and schema configuration for the collaborative research agent.

Defines the role description, UI description, and A2UI surface templates
that the LLM uses to generate rich UI responses.
"""

from a2ui.core.schema.constants import VERSION_0_8
from a2ui.core.schema.manager import A2uiSchemaManager
from a2ui.basic_catalog.provider import BasicCatalog
from a2ui.core.schema.common_modifiers import remove_strict_validation

ROLE_DESCRIPTION = """You are a collaborative deep research assistant. You help users find information
from ambiguous, recall-based queries like "that meeting I had about payments with a guy from Austin."

Your approach:
1. Parse what the user knows and what's unclear
2. Search available sources (contacts, calendar, documents) in parallel
3. Build a structured artifact (contact card, meeting summary, etc.) that evolves as facts come in
4. Ask clarifying questions ONLY when you can't resolve ambiguity through search
5. Always show what you understood and what you're doing

Key principles:
- DON'T ask what you can search. If "guy from Austin" + "payments" is enough to search, do it first.
- SHOW your work. Surface what you understood, what you're searching, what you found.
- BUILD progressively. Don't wait for all results — update the UI as each source responds.
- BE collaborative. Present hypotheses and let the user confirm/reject/refine."""

UI_DESCRIPTION = """
You manage THREE A2UI surfaces simultaneously:

1. **research-artifact** — The main deliverable. An evolving structured result.
   - For contacts: Show a contact card (name, title, team, location, email, avatar)
   - For meetings: Show meeting details (title, date, attendees, key points, action items)
   - For documents: Show document reference (title, author, summary, link)
   - Use the CONTACT_CARD_EXAMPLE or MEETING_SUMMARY_EXAMPLE templates

2. **research-clarification** — Interactive disambiguation.
   - Show when you find multiple possible matches
   - Use Button components for each option
   - Include a "None of these" button
   - Dismiss when the user makes a selection

3. **research-status** — Live search progress.
   - Show which sources are being searched
   - Update status as each completes (✅ done, ⏳ searching, ⬚ queued)
   - Show result counts

Rules for surface management:
- Always start with research-status to show you're working
- Build research-artifact progressively as results come in
- Only show research-clarification when disambiguation is truly needed
- Use dataModelUpdate to update data without re-sending components
"""

WORKFLOW_DESCRIPTION = """
When you receive a query:
1. Call search tools to find relevant information
2. If results are unambiguous, build the artifact directly
3. If multiple matches found, show clarification UI with options
4. After user clarifies (via text or clientEvent), refine and complete the artifact
5. Offer follow-up actions: "Tell me more", "Email them", "Show related docs"
"""


# --- A2UI Component Templates (included as examples for the LLM) ---

CONTACT_CARD_EXAMPLE = [
    {
        "beginRendering": {
            "surfaceId": "research-artifact",
            "root": "artifact-column",
        }
    },
    {
        "surfaceUpdate": {
            "surfaceId": "research-artifact",
            "components": [
                {
                    "id": "artifact-column",
                    "component": {
                        "Column": {
                            "children": {
                                "explicitList": [
                                    "research-title",
                                    "contact-card",
                                    "action-row",
                                ]
                            }
                        }
                    },
                },
                {
                    "id": "research-title",
                    "component": {
                        "Text": {
                            "text": {"path": "/title"},
                            "usageHint": "h3",
                        }
                    },
                },
                {
                    "id": "contact-card",
                    "component": {
                        "Card": {
                            "children": {
                                "explicitList": [
                                    "contact-header-row",
                                    "contact-divider",
                                    "contact-details-column",
                                ]
                            },
                            "elevation": 2,
                        }
                    },
                },
                {
                    "id": "contact-header-row",
                    "component": {
                        "Row": {
                            "children": {
                                "explicitList": ["contact-avatar", "contact-name-col"]
                            },
                            "alignment": "center",
                        }
                    },
                },
                {
                    "id": "contact-avatar",
                    "component": {
                        "Image": {
                            "url": {"path": "/contact/imageUrl"},
                            "usageHint": "avatar",
                            "fit": "cover",
                        }
                    },
                },
                {
                    "id": "contact-name-col",
                    "component": {
                        "Column": {
                            "children": {
                                "explicitList": [
                                    "contact-name",
                                    "contact-title",
                                    "contact-team",
                                ]
                            }
                        }
                    },
                },
                {
                    "id": "contact-name",
                    "component": {
                        "Text": {
                            "text": {"path": "/contact/name"},
                            "usageHint": "h2",
                        }
                    },
                },
                {
                    "id": "contact-title",
                    "component": {
                        "Text": {"text": {"path": "/contact/title"}}
                    },
                },
                {
                    "id": "contact-team",
                    "component": {
                        "Text": {"text": {"path": "/contact/teamAndLocation"}}
                    },
                },
                {
                    "id": "contact-divider",
                    "component": {"Divider": {}},
                },
                {
                    "id": "contact-details-column",
                    "component": {
                        "Column": {
                            "children": {
                                "explicitList": [
                                    "contact-email-row",
                                    "contact-phone-row",
                                    "contact-location-row",
                                ]
                            }
                        }
                    },
                },
                {
                    "id": "contact-email-row",
                    "component": {
                        "Row": {
                            "children": {
                                "explicitList": ["email-icon", "email-text"]
                            }
                        }
                    },
                },
                {
                    "id": "email-icon",
                    "component": {"Icon": {"name": {"literalString": "mail"}}},
                },
                {
                    "id": "email-text",
                    "component": {
                        "Text": {"text": {"path": "/contact/email"}}
                    },
                },
                {
                    "id": "contact-phone-row",
                    "component": {
                        "Row": {
                            "children": {
                                "explicitList": ["phone-icon", "phone-text"]
                            }
                        }
                    },
                },
                {
                    "id": "phone-icon",
                    "component": {"Icon": {"name": {"literalString": "phone"}}},
                },
                {
                    "id": "phone-text",
                    "component": {
                        "Text": {"text": {"path": "/contact/phone"}}
                    },
                },
                {
                    "id": "contact-location-row",
                    "component": {
                        "Row": {
                            "children": {
                                "explicitList": ["location-icon", "location-text"]
                            }
                        }
                    },
                },
                {
                    "id": "location-icon",
                    "component": {
                        "Icon": {"name": {"literalString": "locationOn"}}
                    },
                },
                {
                    "id": "location-text",
                    "component": {
                        "Text": {"text": {"path": "/contact/location"}}
                    },
                },
                {
                    "id": "action-row",
                    "component": {
                        "Row": {
                            "children": {
                                "explicitList": [
                                    "btn-more-details",
                                    "btn-email",
                                    "btn-schedule",
                                ]
                            }
                        }
                    },
                },
                {
                    "id": "btn-more-details",
                    "component": {
                        "Button": {
                            "label": {"literalString": "🔍 More details"},
                            "style": "outlined",
                            "clientEvent": {
                                "eventId": "expand-detail",
                                "data": {"section": "contact"},
                            },
                        }
                    },
                },
                {
                    "id": "btn-email",
                    "component": {
                        "Button": {
                            "label": {"literalString": "✉️ Email"},
                            "style": "outlined",
                            "clientEvent": {
                                "eventId": "action-email",
                                "data": {"contactId": {"path": "/contact/id"}},
                            },
                        }
                    },
                },
                {
                    "id": "btn-schedule",
                    "component": {
                        "Button": {
                            "label": {"literalString": "📅 Schedule meeting"},
                            "style": "outlined",
                            "clientEvent": {
                                "eventId": "action-schedule",
                                "data": {"contactId": {"path": "/contact/id"}},
                            },
                        }
                    },
                },
            ],
        }
    },
]

MEETING_CLARIFICATION_EXAMPLE = [
    {
        "beginRendering": {
            "surfaceId": "research-clarification",
            "root": "clarification-column",
        }
    },
    {
        "surfaceUpdate": {
            "surfaceId": "research-clarification",
            "components": [
                {
                    "id": "clarification-column",
                    "component": {
                        "Column": {
                            "children": {
                                "explicitList": [
                                    "clarify-prompt",
                                    "option-1-card",
                                    "option-2-card",
                                    "option-3-card",
                                    "none-button",
                                ]
                            }
                        }
                    },
                },
                {
                    "id": "clarify-prompt",
                    "component": {
                        "Text": {
                            "text": {
                                "literalString": "I found multiple matching meetings. Which one?"
                            },
                            "usageHint": "h4",
                        }
                    },
                },
                {
                    "id": "option-1-card",
                    "component": {
                        "Card": {
                            "children": {
                                "explicitList": ["opt1-title", "opt1-detail", "opt1-btn"]
                            }
                        }
                    },
                },
                {
                    "id": "opt1-title",
                    "component": {
                        "Text": {
                            "text": {"path": "/options/0/title"},
                            "usageHint": "h5",
                        }
                    },
                },
                {
                    "id": "opt1-detail",
                    "component": {
                        "Text": {"text": {"path": "/options/0/detail"}}
                    },
                },
                {
                    "id": "opt1-btn",
                    "component": {
                        "Button": {
                            "label": {"literalString": "This one"},
                            "style": "filled",
                            "clientEvent": {
                                "eventId": "select-hypothesis",
                                "data": {"meetingId": {"path": "/options/0/id"}},
                            },
                        }
                    },
                },
                {
                    "id": "option-2-card",
                    "component": {
                        "Card": {
                            "children": {
                                "explicitList": ["opt2-title", "opt2-detail", "opt2-btn"]
                            }
                        }
                    },
                },
                {
                    "id": "opt2-title",
                    "component": {
                        "Text": {
                            "text": {"path": "/options/1/title"},
                            "usageHint": "h5",
                        }
                    },
                },
                {
                    "id": "opt2-detail",
                    "component": {
                        "Text": {"text": {"path": "/options/1/detail"}}
                    },
                },
                {
                    "id": "opt2-btn",
                    "component": {
                        "Button": {
                            "label": {"literalString": "This one"},
                            "style": "filled",
                            "clientEvent": {
                                "eventId": "select-hypothesis",
                                "data": {"meetingId": {"path": "/options/1/id"}},
                            },
                        }
                    },
                },
                {
                    "id": "option-3-card",
                    "component": {
                        "Card": {
                            "children": {
                                "explicitList": ["opt3-title", "opt3-detail", "opt3-btn"]
                            }
                        }
                    },
                },
                {
                    "id": "opt3-title",
                    "component": {
                        "Text": {
                            "text": {"path": "/options/2/title"},
                            "usageHint": "h5",
                        }
                    },
                },
                {
                    "id": "opt3-detail",
                    "component": {
                        "Text": {"text": {"path": "/options/2/detail"}}
                    },
                },
                {
                    "id": "opt3-btn",
                    "component": {
                        "Button": {
                            "label": {"literalString": "This one"},
                            "style": "filled",
                            "clientEvent": {
                                "eventId": "select-hypothesis",
                                "data": {"meetingId": {"path": "/options/2/id"}},
                            },
                        }
                    },
                },
                {
                    "id": "none-button",
                    "component": {
                        "Button": {
                            "label": {"literalString": "None of these"},
                            "style": "outlined",
                            "clientEvent": {
                                "eventId": "reject-all",
                                "data": {},
                            },
                        }
                    },
                },
            ],
        }
    },
]

RESEARCH_STATUS_EXAMPLE = [
    {
        "beginRendering": {
            "surfaceId": "research-status",
            "root": "status-column",
        }
    },
    {
        "surfaceUpdate": {
            "surfaceId": "research-status",
            "components": [
                {
                    "id": "status-column",
                    "component": {
                        "Column": {
                            "children": {
                                "explicitList": [
                                    "status-title",
                                    "status-contacts",
                                    "status-calendar",
                                    "status-documents",
                                    "status-web",
                                    "status-summary",
                                ]
                            }
                        }
                    },
                },
                {
                    "id": "status-title",
                    "component": {
                        "Text": {
                            "text": {"literalString": "🔎 Searching..."},
                            "usageHint": "h4",
                        }
                    },
                },
                {
                    "id": "status-contacts",
                    "component": {
                        "Row": {
                            "children": {
                                "explicitList": ["contacts-icon", "contacts-label"]
                            }
                        }
                    },
                },
                {
                    "id": "contacts-icon",
                    "component": {
                        "Text": {"text": {"path": "/sources/contacts/icon"}}
                    },
                },
                {
                    "id": "contacts-label",
                    "component": {
                        "Text": {"text": {"path": "/sources/contacts/label"}}
                    },
                },
                {
                    "id": "status-calendar",
                    "component": {
                        "Row": {
                            "children": {
                                "explicitList": ["calendar-icon", "calendar-label"]
                            }
                        }
                    },
                },
                {
                    "id": "calendar-icon",
                    "component": {
                        "Text": {"text": {"path": "/sources/calendar/icon"}}
                    },
                },
                {
                    "id": "calendar-label",
                    "component": {
                        "Text": {"text": {"path": "/sources/calendar/label"}}
                    },
                },
                {
                    "id": "status-documents",
                    "component": {
                        "Row": {
                            "children": {
                                "explicitList": ["documents-icon", "documents-label"]
                            }
                        }
                    },
                },
                {
                    "id": "documents-icon",
                    "component": {
                        "Text": {"text": {"path": "/sources/documents/icon"}}
                    },
                },
                {
                    "id": "documents-label",
                    "component": {
                        "Text": {"text": {"path": "/sources/documents/label"}}
                    },
                },
                {
                    "id": "status-web",
                    "component": {
                        "Row": {
                            "children": {
                                "explicitList": ["web-icon", "web-label"]
                            }
                        }
                    },
                },
                {
                    "id": "web-icon",
                    "component": {
                        "Text": {"text": {"path": "/sources/web/icon"}}
                    },
                },
                {
                    "id": "web-label",
                    "component": {
                        "Text": {"text": {"path": "/sources/web/label"}}
                    },
                },
                {
                    "id": "status-summary",
                    "component": {
                        "Text": {
                            "text": {"path": "/statusSummary"},
                            "usageHint": "caption",
                        }
                    },
                },
            ],
        }
    },
]

MEETING_SUMMARY_EXAMPLE = [
    {
        "beginRendering": {
            "surfaceId": "research-artifact",
            "root": "meeting-column",
        }
    },
    {
        "surfaceUpdate": {
            "surfaceId": "research-artifact",
            "components": [
                {
                    "id": "meeting-column",
                    "component": {
                        "Column": {
                            "children": {
                                "explicitList": [
                                    "meeting-card",
                                    "meeting-actions",
                                ]
                            }
                        }
                    },
                },
                {
                    "id": "meeting-card",
                    "component": {
                        "Card": {
                            "children": {
                                "explicitList": [
                                    "meeting-title",
                                    "meeting-datetime",
                                    "meeting-divider",
                                    "meeting-attendees-label",
                                    "meeting-attendees",
                                    "meeting-divider-2",
                                    "meeting-notes-label",
                                    "meeting-notes",
                                    "meeting-actions-label",
                                    "meeting-action-items",
                                ]
                            },
                            "elevation": 2,
                        }
                    },
                },
                {
                    "id": "meeting-title",
                    "component": {
                        "Text": {
                            "text": {"path": "/meeting/title"},
                            "usageHint": "h2",
                        }
                    },
                },
                {
                    "id": "meeting-datetime",
                    "component": {
                        "Text": {
                            "text": {"path": "/meeting/datetime"},
                            "usageHint": "subtitle1",
                        }
                    },
                },
                {
                    "id": "meeting-divider",
                    "component": {"Divider": {}},
                },
                {
                    "id": "meeting-attendees-label",
                    "component": {
                        "Text": {
                            "text": {"literalString": "Attendees"},
                            "usageHint": "h5",
                        }
                    },
                },
                {
                    "id": "meeting-attendees",
                    "component": {
                        "Text": {"text": {"path": "/meeting/attendeesText"}}
                    },
                },
                {
                    "id": "meeting-divider-2",
                    "component": {"Divider": {}},
                },
                {
                    "id": "meeting-notes-label",
                    "component": {
                        "Text": {
                            "text": {"literalString": "Key Points"},
                            "usageHint": "h5",
                        }
                    },
                },
                {
                    "id": "meeting-notes",
                    "component": {
                        "Text": {"text": {"path": "/meeting/notes"}}
                    },
                },
                {
                    "id": "meeting-actions-label",
                    "component": {
                        "Text": {
                            "text": {"literalString": "Action Items"},
                            "usageHint": "h5",
                        }
                    },
                },
                {
                    "id": "meeting-action-items",
                    "component": {
                        "Text": {"text": {"path": "/meeting/actionItemsText"}}
                    },
                },
                {
                    "id": "meeting-actions",
                    "component": {
                        "Row": {
                            "children": {
                                "explicitList": [
                                    "btn-related-docs",
                                    "btn-attendee-details",
                                ]
                            }
                        }
                    },
                },
                {
                    "id": "btn-related-docs",
                    "component": {
                        "Button": {
                            "label": {"literalString": "📄 Related docs"},
                            "style": "outlined",
                            "clientEvent": {
                                "eventId": "expand-detail",
                                "data": {"section": "documents"},
                            },
                        }
                    },
                },
                {
                    "id": "btn-attendee-details",
                    "component": {
                        "Button": {
                            "label": {"literalString": "👥 Attendee details"},
                            "style": "outlined",
                            "clientEvent": {
                                "eventId": "expand-detail",
                                "data": {"section": "attendees"},
                            },
                        }
                    },
                },
            ],
        }
    },
]


def get_schema_manager() -> A2uiSchemaManager:
    """Create an A2UI schema manager configured with the basic catalog."""
    return A2uiSchemaManager(
        VERSION_0_8,
        catalogs=[
            BasicCatalog.get_config(version=VERSION_0_8, examples_path="examples")
        ],
        schema_modifiers=[remove_strict_validation],
    )


def get_text_prompt() -> str:
    """Construct the text-only prompt (no A2UI)."""
    return f"""{ROLE_DESCRIPTION}

{WORKFLOW_DESCRIPTION}

Format your responses as clear, structured text with headers and bullet points.
For contact info, show: name, title, team, location, email.
For meetings, show: title, date, attendees, key points, action items.
For documents, show: title, author, date, summary, link.
"""
