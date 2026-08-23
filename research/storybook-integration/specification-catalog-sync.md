# Specification: Storybook to A2UI Catalog Sync

This specification defines the file formats, mapping rules, and execution pipeline for utilizing Storybook as a unified, programmatic source of truth for A2UI Component Catalogs.

---

## 1. Architectural Concept

The sync system bridges the gap between **design-system engineering (Storybook)** and **agentic UI execution (A2UI)**. It differentiates between two distinct structural tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          A2UI COMPONENT LAYERS                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Primitives (Atomic Layout & UI)                                     │
│    e.g., Row, Column, Button, Text, Image, Input                       │
│    - High flexibility, high token cost, large agent search space.       │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Templates (Higher-Order Compositions)                               │
│    e.g., FlightStatus, MetricCard, UserProfileHeader, EmailCompose     │
│    - Lower flexibility, zero token waste, fast deterministic rendering. │
└────────────────────────────────────────────────────────────────────────┘
```

By indexing both primitives and templates in Storybook, we can generate a dual-layer A2UI catalog. This allows the agent to construct layouts using high-level modules first, falling back to low-level primitives only when bespoke layouts are required.

---

## 2. Sync Pipeline Pipeline

```
  [ React/Vite Codebase ]
            │
            ▼ (Statically analyzes typescript props)
   [ Storybook Build ]
            │
            ├───► Generates: index.json (list of stories)
            └───► Generates: project.json (full docgen argTypes metadata)
            │
            ▼ (CLI Compiler: storybook-to-a2ui-catalog)
     [ catalog.json ]
            │
            ├───► Loaded by AI Agent (validation, planning, and prompting)
            └───► Loaded by A2UI Composer (visual editor sidebar & inputs)
```

---

## 3. Translation Mapping Rules

The sync compiler applies the following deterministic mapping rules when converting a Storybook story into an A2UI catalog entry:

### Rule 1: Component Definition
A Storybook component suite (represented by its CSF `default export`) maps to an **A2UI Catalog Component**.

* **Component ID:** Extracted from the default export `title` (e.g., `title: "Design System/Cards/MetricCard"` $\rightarrow$ `id: "MetricCard"`).
* **Description:** Extracted from JSDoc comments sitting above the React component declaration.

---

### Rule 2: Component Properties (`argTypes`)
Storybook `argTypes` controls map to the A2UI component prop specification.

| Storybook control type | A2UI Schema Type | Validation Rules |
| :--- | :--- | :--- |
| `boolean` | `boolean` | None |
| `number` | `number` | Maps `min`, `max`, `step` constraints |
| `text` | `string` | None |
| `select` / `radio` | `enum` | Array of strings extracted from `options` |
| `object` | `object` / `JSON` | Nested JSON object |

**Example Prop Translation:**
```json
// Storybook Source
"variant": {
  "description": "Visual weight",
  "control": { "type": "select" },
  "options": ["primary", "secondary", "outline"]
}

// Generated A2UI Catalog Prop
{
  "name": "variant",
  "description": "Visual weight",
  "type": "enum",
  "values": ["primary", "secondary", "outline"],
  "default": "primary"
}
```

---

### Rule 3: Presets & Examples (Story Named Exports)
Each named export (an individual story) maps directly to an **A2UI Catalog Example Preset**.

* If a story named `Loading` is defined with specific `args` (e.g., `isLoading: true`), the compiler outputs an A2UI catalog example showcasing how to call this component in its loading state.
* **Benefit:** Agents can scan these presets to instantly understand valid argument configurations, bypassing abstract schema-reading errors.

---

## 4. The Templates Layer Schema (`template.json`)

To enable a2ui as a modular composer, we introduce a `template` specification. A template is a pre-assembled layout of primitives and bound values.

**Proposed Schema Definition:**
```json
{
  "id": "MetricCard",
  "type": "template",
  "description": "Dashboard stat display showing title, value, percentage change, and trend visual.",
  "inputs": [
    {
      "name": "title",
      "type": "string",
      "description": "Label for the metric (e.g., Revenue)"
    },
    {
      "name": "value",
      "type": "string",
      "description": "The big display number (e.g., $45,231)"
    },
    {
      "name": "trend",
      "type": "number",
      "description": "Percentage change (positive or negative)"
    }
  ],
  "layout": {
    "component": "Card",
    "props": { "padding": "md" },
    "children": [
      {
        "component": "Row",
        "props": { "alignment": "center", "distribution": "spaceBetween" },
        "children": [
          {
            "component": "Text",
            "props": { "text": { "binding": "inputs/title" }, "usageHint": "caption" }
          },
          {
            "component": "Icon",
            "props": { "name": "trending-up", "color": "green" }
          }
        ]
      },
      {
        "component": "Text",
        "props": { "text": { "binding": "inputs/value" }, "usageHint": "h2" }
      }
    ]
  }
}
```

* **Why this is powerful:** The AI Agent does not need to output a massive nested layout of Card, Row, Column, and Text components. It simply outputs a single template call:
  ```json
  {
    "component": "MetricCard",
    "props": {
      "title": "Active Users",
      "value": "12,453",
      "trend": 4.5
    }
  }
  ```
  The renderer maps these input values directly into the underlying layout binding, speeding up generation, slashing token bills, and guaranteeing visual correctness.
