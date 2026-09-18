import json
from pathlib import Path

COMMON_TYPES = "https://a2ui.org/specification/v0_9/common_types.json"

COMPONENTS = {
    "Accordion": {
        "description": "A vertically stacked set of interactive headings that each reveal a section of content.",
        "properties": {
            "type": {"type": "string", "enum": ["single", "multiple"], "default": "single"},
            "collapsible": {"type": "boolean", "default": True},
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "value": {"type": "string"},
                        "trigger": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
                        "content": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
                    },
                    "required": ["value", "trigger", "content"]
                }
            }
        },
        "required": ["component", "items"]
    },
    "Alert": {
        "description": "Displays a callout for user attention with variant styles.",
        "properties": {
            "variant": {"type": "string", "enum": ["default", "destructive"], "default": "default"},
            "title": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "description": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"}
        },
        "required": ["component"]
    },
    "AlertDialog": {
        "description": "A modal dialog that interrupts the user with important content and expects a response.",
        "properties": {
            "title": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "description": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "actionText": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "cancelText": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "action": {"$ref": f"{COMMON_TYPES}#/$defs/Action"}
        },
        "required": ["component", "title"]
    },
    "AspectRatio": {
        "description": "Displays content within a desired ratio.",
        "properties": {
            "ratio": {"type": "number", "default": 1.7777777777777777},
            "child": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
        },
        "required": ["component", "child"]
    },
    "Avatar": {
        "description": "An image element with a fallback for representing the user.",
        "properties": {
            "src": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "fallback": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "alt": {"type": "string"}
        },
        "required": ["component", "fallback"]
    },
    "Badge": {
        "description": "Displays a small badge or status pill.",
        "properties": {
            "text": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "variant": {"type": "string", "enum": ["default", "secondary", "destructive", "outline"], "default": "default"}
        },
        "required": ["component", "text"]
    },
    "Breadcrumb": {
        "description": "Displays the path to the current resource using a hierarchy of links.",
        "properties": {
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "label": {"type": "string"},
                        "href": {"type": "string"},
                        "isCurrent": {"type": "boolean"}
                    },
                    "required": ["label"]
                }
            }
        },
        "required": ["component", "items"]
    },
    "Button": {
        "description": "Displays a button or component that looks like a button.",
        "properties": {
            "text": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "variant": {"type": "string", "enum": ["default", "destructive", "outline", "secondary", "ghost", "link"], "default": "default"},
            "size": {"type": "string", "enum": ["default", "sm", "lg", "icon"], "default": "default"},
            "disabled": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicBoolean"},
            "action": {"$ref": f"{COMMON_TYPES}#/$defs/Action"}
        },
        "required": ["component"]
    },
    "ButtonGroup": {
        "description": "Groups closely related buttons together visually.",
        "properties": {
            "orientation": {"type": "string", "enum": ["horizontal", "vertical"], "default": "horizontal"},
            "children": {"$ref": f"{COMMON_TYPES}#/$defs/ChildList"}
        },
        "required": ["component", "children"]
    },
    "Calendar": {
        "description": "A date picker calendar component that allows users to select days or ranges.",
        "properties": {
            "mode": {"type": "string", "enum": ["single", "range", "multiple"], "default": "single"},
            "selected": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"}
        },
        "required": ["component"]
    },
    "Card": {
        "description": "Displays a card with header, title, description, content, and footer.",
        "properties": {
            "title": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "description": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "content": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"},
            "footer": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
        },
        "required": ["component"]
    },
    "Carousel": {
        "description": "A carousel with motion and swipe capabilities.",
        "properties": {
            "orientation": {"type": "string", "enum": ["horizontal", "vertical"], "default": "horizontal"},
            "slides": {"$ref": f"{COMMON_TYPES}#/$defs/ChildList"}
        },
        "required": ["component", "slides"]
    },
    "Chart": {
        "description": "Displays charts and graphs (bar, line, pie, area) powered by Recharts.",
        "properties": {
            "type": {"type": "string", "enum": ["bar", "line", "area", "pie"], "default": "bar"},
            "data": {"type": "array"},
            "config": {"type": "object"}
        },
        "required": ["component", "data"]
    },
    "Checkbox": {
        "description": "A control that allows the user to toggle between checked and not checked.",
        "properties": {
            "label": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "checked": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicBoolean"},
            "disabled": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicBoolean"}
        },
        "required": ["component"]
    },
    "Collapsible": {
        "description": "An interactive component which can be expanded or collapsed.",
        "properties": {
            "title": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "open": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicBoolean"},
            "content": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
        },
        "required": ["component", "content"]
    },
    "Command": {
        "description": "Fast, composable, unstyled command menu for searching and actions.",
        "properties": {
            "placeholder": {"type": "string"},
            "groups": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "heading": {"type": "string"},
                        "items": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {"type": "string"},
                                    "label": {"type": "string"},
                                    "shortcut": {"type": "string"}
                                },
                                "required": ["id", "label"]
                            }
                        }
                    },
                    "required": ["heading", "items"]
                }
            }
        },
        "required": ["component"]
    },
    "ContextMenu": {
        "description": "Displays a menu to the user — such as a set of actions or functions — triggered by right click.",
        "properties": {
            "trigger": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"},
            "items": {"type": "array"}
        },
        "required": ["component", "trigger"]
    },
    "Dialog": {
        "description": "A window overlaid on either the primary window or another dialog window.",
        "properties": {
            "title": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "description": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "trigger": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"},
            "content": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
        },
        "required": ["component"]
    },
    "Drawer": {
        "description": "A drawer modal that slides up from the bottom of the screen.",
        "properties": {
            "title": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "description": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "content": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
        },
        "required": ["component"]
    },
    "DropdownMenu": {
        "description": "Displays a menu to the user triggered by a button.",
        "properties": {
            "trigger": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"},
            "items": {"type": "array"}
        },
        "required": ["component", "trigger"]
    },
    "Empty": {
        "description": "Displays an empty state container with icon, title, description, and call to action.",
        "properties": {
            "title": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "description": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "action": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
        },
        "required": ["component", "title"]
    },
    "Field": {
        "description": "A complete field wrapper providing label, input control, and helper/error descriptions.",
        "properties": {
            "label": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "description": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "error": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "content": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
        },
        "required": ["component", "content"]
    },
    "Form": {
        "description": "A form container with schema validation and field state management.",
        "properties": {
            "children": {"$ref": f"{COMMON_TYPES}#/$defs/ChildList"},
            "onSubmit": {"$ref": f"{COMMON_TYPES}#/$defs/Action"}
        },
        "required": ["component", "children"]
    },
    "HoverCard": {
        "description": "For sighted users to preview content available behind a link.",
        "properties": {
            "trigger": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"},
            "content": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
        },
        "required": ["component", "trigger", "content"]
    },
    "Input": {
        "description": "Displays a form input field or a component that looks like an input field.",
        "properties": {
            "type": {"type": "string", "enum": ["text", "password", "email", "number", "tel", "url", "search"], "default": "text"},
            "placeholder": {"type": "string"},
            "value": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "disabled": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicBoolean"}
        },
        "required": ["component"]
    },
    "InputGroup": {
        "description": "An input element grouped with prepended or appended icons, text, or buttons.",
        "properties": {
            "placeholder": {"type": "string"},
            "prefix": {"type": "string"},
            "suffix": {"type": "string"}
        },
        "required": ["component"]
    },
    "InputOTP": {
        "description": "Accessible one-time password / PIN component with copy paste and numeric inputs.",
        "properties": {
            "maxLength": {"type": "integer", "default": 6},
            "value": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"}
        },
        "required": ["component"]
    },
    "Item": {
        "description": "A generic list item container with media/icon, title, subtitle, and action slots.",
        "properties": {
            "title": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "description": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "variant": {"type": "string", "enum": ["default", "outline", "muted"], "default": "default"},
            "actions": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
        },
        "required": ["component", "title"]
    },
    "Kbd": {
        "description": "Displays a keyboard key or shortcut combination.",
        "properties": {
            "keys": {"type": "array", "items": {"type": "string"}}
        },
        "required": ["component", "keys"]
    },
    "Label": {
        "description": "Renders an accessible label associated with controls.",
        "properties": {
            "text": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "htmlFor": {"type": "string"}
        },
        "required": ["component", "text"]
    },
    "Menubar": {
        "description": "A visually persistent menu common in desktop applications for quick access to commands.",
        "properties": {
            "menus": {"type": "array"}
        },
        "required": ["component", "menus"]
    },
    "NavigationMenu": {
        "description": "A collection of links for navigating websites.",
        "properties": {
            "items": {"type": "array"}
        },
        "required": ["component", "items"]
    },
    "Pagination": {
        "description": "Pagination with page navigation, next, previous and page number links.",
        "properties": {
            "currentPage": {"type": "integer", "default": 1},
            "totalPages": {"type": "integer", "default": 1}
        },
        "required": ["component", "totalPages"]
    },
    "Popover": {
        "description": "Displays rich content in a portal, triggered by a button.",
        "properties": {
            "trigger": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"},
            "content": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
        },
        "required": ["component", "trigger", "content"]
    },
    "Progress": {
        "description": "Displays an indicator showing the completion progress of a task.",
        "properties": {
            "value": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicNumber"},
            "max": {"type": "number", "default": 100}
        },
        "required": ["component", "value"]
    },
    "RadioGroup": {
        "description": "A set of checkable buttons—known as radio buttons—where no more than one can be checked.",
        "properties": {
            "options": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "value": {"type": "string"},
                        "label": {"type": "string"}
                    },
                    "required": ["value", "label"]
                }
            },
            "value": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"}
        },
        "required": ["component", "options"]
    },
    "Resizable": {
        "description": "Accessible resizable panel groups and layouts with drag handles.",
        "properties": {
            "direction": {"type": "string", "enum": ["horizontal", "vertical"], "default": "horizontal"},
            "panels": {"$ref": f"{COMMON_TYPES}#/$defs/ChildList"}
        },
        "required": ["component", "panels"]
    },
    "ScrollArea": {
        "description": "Augments native scroll with custom cross-browser styling.",
        "properties": {
            "content": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"},
            "maxHeight": {"type": "string"}
        },
        "required": ["component", "content"]
    },
    "Select": {
        "description": "Displays a list of options for the user to pick from—triggered by a button.",
        "properties": {
            "placeholder": {"type": "string"},
            "options": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "value": {"type": "string"},
                        "label": {"type": "string"}
                    },
                    "required": ["value", "label"]
                }
            },
            "value": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"}
        },
        "required": ["component", "options"]
    },
    "Separator": {
        "description": "Visually or semantically separates content.",
        "properties": {
            "orientation": {"type": "string", "enum": ["horizontal", "vertical"], "default": "horizontal"}
        },
        "required": ["component"]
    },
    "Sheet": {
        "description": "Extends the Dialog component to display content that complements the screen from any side.",
        "properties": {
            "side": {"type": "string", "enum": ["top", "right", "bottom", "left"], "default": "right"},
            "title": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "description": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "content": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
        },
        "required": ["component"]
    },
    "Sidebar": {
        "description": "A composable, collapsible navigation sidebar component.",
        "properties": {
            "header": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"},
            "content": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"},
            "footer": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
        },
        "required": ["component", "content"]
    },
    "Skeleton": {
        "description": "Use to show a placeholder while content is loading.",
        "properties": {
            "width": {"type": "string"},
            "height": {"type": "string"},
            "circle": {"type": "boolean", "default": False}
        },
        "required": ["component"]
    },
    "Slider": {
        "description": "An input where the user selects a value from within a given range.",
        "properties": {
            "min": {"type": "number", "default": 0},
            "max": {"type": "number", "default": 100},
            "step": {"type": "number", "default": 1},
            "value": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicNumber"}
        },
        "required": ["component"]
    },
    "Sonner": {
        "description": "An opinionated toast component for feedback notifications.",
        "properties": {
            "message": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "description": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "type": {"type": "string", "enum": ["info", "success", "warning", "error"], "default": "info"}
        },
        "required": ["component", "message"]
    },
    "Spinner": {
        "description": "Indicates an active indeterminate loading state.",
        "properties": {
            "size": {"type": "string", "enum": ["sm", "default", "lg"], "default": "default"}
        },
        "required": ["component"]
    },
    "Switch": {
        "description": "A control that allows the user to toggle between checked and not checked.",
        "properties": {
            "checked": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicBoolean"},
            "disabled": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicBoolean"}
        },
        "required": ["component"]
    },
    "Table": {
        "description": "A responsive table component for structured tabular data.",
        "properties": {
            "headers": {"type": "array", "items": {"type": "string"}},
            "rows": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicValue"}
                }
            },
            "caption": {"type": "string"}
        },
        "required": ["component", "rows"]
    },
    "Tabs": {
        "description": "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
        "properties": {
            "defaultValue": {"type": "string"},
            "tabs": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "value": {"type": "string"},
                        "label": {"type": "string"},
                        "content": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"}
                    },
                    "required": ["value", "label", "content"]
                }
            }
        },
        "required": ["component", "tabs"]
    },
    "Textarea": {
        "description": "Displays a form textarea or a component that looks like a textarea.",
        "properties": {
            "placeholder": {"type": "string"},
            "value": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"},
            "disabled": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicBoolean"},
            "rows": {"type": "integer", "default": 3}
        },
        "required": ["component"]
    },
    "Toggle": {
        "description": "A two-state button that can be either on or off.",
        "properties": {
            "pressed": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicBoolean"},
            "variant": {"type": "string", "enum": ["default", "outline"], "default": "default"},
            "size": {"type": "string", "enum": ["default", "sm", "lg"], "default": "default"},
            "label": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"}
        },
        "required": ["component"]
    },
    "ToggleGroup": {
        "description": "A set of two-state buttons that can be toggled on or off.",
        "properties": {
            "type": {"type": "string", "enum": ["single", "multiple"], "default": "single"},
            "variant": {"type": "string", "enum": ["default", "outline"], "default": "default"},
            "size": {"type": "string", "enum": ["default", "sm", "lg"], "default": "default"},
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "value": {"type": "string"},
                        "label": {"type": "string"}
                    },
                    "required": ["value", "label"]
                }
            }
        },
        "required": ["component", "items"]
    },
    "Tooltip": {
        "description": "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
        "properties": {
            "trigger": {"$ref": f"{COMMON_TYPES}#/$defs/ComponentId"},
            "content": {"$ref": f"{COMMON_TYPES}#/$defs/DynamicString"}
        },
        "required": ["component", "trigger", "content"]
    }
}

def generate():
    catalog_schema = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://a2ui.org/catalogs/shadcn/catalog.json",
        "title": "A2UI ShadCN Component Catalog",
        "description": "Unified catalog of 53 ShadCN UI components and controls for A2UI agents.",
        "catalogId": "https://a2ui.org/catalogs/shadcn/catalog.json",
        "components": {}
    }

    for name, spec in sorted(COMPONENTS.items()):
        props = dict(spec["properties"])
        props["component"] = {"const": name}
        reqs = list(spec.get("required", ["component"]))
        if "component" not in reqs:
            reqs.insert(0, "component")

        catalog_schema["components"][name] = {
            "type": "object",
            "description": spec["description"],
            "allOf": [
                {
                    "$ref": f"{COMMON_TYPES}#/$defs/ComponentCommon"
                },
                {
                    "type": "object",
                    "properties": props,
                    "required": reqs
                }
            ],
            "unevaluatedProperties": False
        }

    out_path = Path("/home/node/work/shadcn-storybook-task/catalogs/shadcn/catalog.json")
    out_path.write_text(json.dumps(catalog_schema, indent=2) + "\n")
    print(f"Wrote {len(catalog_schema['components'])} components to {out_path}")

if __name__ == "__main__":
    generate()
