# Bringing Your Own Design System to A2UI

One of A2UI's core architectural advantages is that **it does not impose a specific visual look, frontend framework, or component library on your application**.

Instead of forcing you to replace your existing UI components with generic primitives, A2UI allows you to declare a **custom catalog** that directly mirrors your organization's design system.

---

## Why Expose Your Own Design System?

- **Zero Design Drift:** The AI agent renders your actual components—styled with your company's CSS, brand tokens, and interaction guidelines.
- **Security & Allowlisting:** Agents can only invoke components and properties that you have explicitly declared in your catalog schema.
- **High Performance:** Native components render directly in your existing frontend runtime without heavy iframe sandboxes or generic DOM wrappers.
- **Lower Token Overhead:** High-level domain components (e.g. `FlightCard`, `MetricTile`, `OrderRow`) require 70-90% fewer tokens from LLMs than assembling low-level layout boxes.

---

## The 3-Part Architecture of an A2UI Catalog

Every A2UI catalog consists of three elements:

```
┌─────────────────────────────────┐
│       1. The JSON Schema        │  ◄── What the AI Agent sees and validates against
│        (`catalog.json`)         │      (component names, property types, required fields)
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│      2. The Client Renderer     │  ◄── What the browser/app renders
│   (React, Lit, Angular, etc.)   │      (maps JSON component names to real frontend components)
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│      3. Storybook Workbench     │  ◄── Where humans & agents visually inspect, test,
│      (Stories & Autodocs)       │      and verify components in isolation
└─────────────────────────────────┘
```

---

## Step-by-Step Implementation Guide

### Step 1: Create your Catalog Schema (`catalog.json`)

Define your components in an A2UI-compliant JSON Schema. Each component extends `ComponentCommon` from the A2UI specification and specifies allowed properties:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/catalogs/my-design-system/catalog.json",
  "catalogId": "urn:company:catalog:core",
  "title": "Acme Core Design System",
  "components": {
    "StatusBadge": {
      "type": "object",
      "allOf": [
        { "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/ComponentCommon" },
        {
          "type": "object",
          "properties": {
            "component": { "const": "StatusBadge" },
            "status": {
              "type": "string",
              "enum": ["active", "pending", "failed", "archived"]
            },
            "label": {
              "$ref": "https://a2ui.org/specification/v0_9/common_types.json#/$defs/DynamicString"
            }
          },
          "required": ["component", "status", "label"]
        }
      ],
      "unevaluatedProperties": false
    }
  }
}
```

> **Tip:** You can use `tools/build_catalog/assemble_catalog.py` to merge multiple partial schemas or extend the official Basic Catalog.

---

### Step 2: Register Components in Your Client Renderer

In your frontend application (e.g. React), register a component map associating catalog component names with your actual implementation:

```tsx
import { A2UIRenderer } from '@a2ui/react';
import { StatusBadge } from '@/components/StatusBadge';
import { CustomerCard } from '@/components/CustomerCard';

const catalogMap = {
  StatusBadge: ({ component, dataModel }) => (
    <StatusBadge
      status={component.status}
      label={component.label}
    />
  ),
  CustomerCard: ({ component, dataModel, renderChild }) => (
    <CustomerCard
      name={component.name}
      avatarUrl={component.avatarUrl}
    >
      {component.content && renderChild(component.content)}
    </CustomerCard>
  )
};

export function AgentUISurface({ surfaceId, messages }) {
  return (
    <A2UIRenderer
      surfaceId={surfaceId}
      catalogId="urn:company:catalog:core"
      components={catalogMap}
      messages={messages}
    />
  );
}
```

---

### Step 3: Use Storybook for Verification & Tooling

If your design system already uses Storybook, you can connect it directly to the A2UI workflow:

1. **Tag stories with `autodocs`:** Ensures component prop types and documentation are available for schema generation.
2. **Use the A2UI Storybook Addon (`@a2ui/storybook-addon`):**
   Install the addon in your `.storybook/main.ts` to embed an A2UI agent chat panel directly into your Storybook. This allows you to test agent UI streaming live against your components in isolation without launching your full application.
3. **Automate Schema Generation:** You can write a build script that reads Storybook's `docgen` output and emits your `catalog.json` automatically on every design system release.

---

### Step 4: Advertise Supported Catalogs to the Agent

When connecting to an A2UI agent (via WebSocket, HTTP SSE, or MCP), your client advertises its capabilities:

```json
{
  "clientCapabilities": {
    "supportedCatalogIds": [
      "https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json",
      "urn:company:catalog:core"
    ]
  }
}
```

The agent will then select your custom catalog (`urn:company:catalog:core`) when generating UI tailored to your application.
