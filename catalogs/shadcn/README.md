# @a2ui/catalog-shadcn

The **ShadCN Component Catalog** for A2UI — a complete, modern UI design system catalog providing 53 primitives, an A2UI Catalog JSON Schema for agent generation, and an interactive Storybook 8 workbench.

---

## Overview

In A2UI, a **Catalog** defines the vocabulary of components, properties, and actions an AI agent is permitted to render on a user interface surface.

`@a2ui/catalog-shadcn` serves two primary functions:

1. **Batteries-Included Reference Catalog:** An immediate, production-grade design system so developers don't have to build custom renderers to get started.
2. **Design System Template:** A reference pattern demonstrating how any existing component library (e.g. Material UI, Ant Design, custom internal design systems) can be exposed to A2UI agents with Storybook-backed verification.

---

## Components Included (53)

| Category                 | Components                                                                                                                                           |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Actions & Buttons**    | `Button`, `ButtonGroup`, `Toggle`, `ToggleGroup`                                                                                                     |
| **Form & Inputs**        | `Input`, `InputGroup`, `InputOTP`, `Textarea`, `Checkbox`, `RadioGroup`, `Select`, `Slider`, `Switch`, `Calendar`, `Field`, `Form`                   |
| **Layout & Containers**  | `Card`, `Accordion`, `Tabs`, `Collapsible`, `Separator`, `ScrollArea`, `Resizable`, `Table`, `Item`, `Empty`                                         |
| **Overlays & Feedback**  | `Dialog`, `AlertDialog`, `Drawer`, `Sheet`, `Popover`, `Tooltip`, `HoverCard`, `ContextMenu`, `DropdownMenu`, `Menubar`, `Alert`, `Sonner` (Toaster) |
| **Navigation**           | `Breadcrumb`, `NavigationMenu`, `Pagination`, `Sidebar`                                                                                              |
| **Data Display & Media** | `Avatar`, `Badge`, `Progress`, `Skeleton`, `Spinner`, `Kbd`, `AspectRatio`, `Chart`                                                                  |

---

## Catalog Schema (`catalog.json`)

Agents targeting this catalog receive the JSON Schema definition:

- **Catalog ID:** `https://a2ui.org/catalogs/shadcn/catalog.json` (alias: `urn:a2ui:catalog:shadcn`)
- **Compatibility:** A2UI Protocol v0.9+ / v0.9.1 / v1.0

### Agent Wire Example

```json
{
  "createSurface": {
    "surfaceId": "dashboard-metric",
    "catalogId": "urn:a2ui:catalog:shadcn"
  }
}
```

```json
{
  "updateComponents": {
    "surfaceId": "dashboard-metric",
    "components": [
      {
        "id": "card-1",
        "component": "Card",
        "title": "Monthly Revenue",
        "description": "Total sales volume across all channels",
        "content": "card-content-1"
      },
      {
        "id": "card-content-1",
        "component": "Badge",
        "text": "+24.5% vs last month",
        "variant": "default"
      }
    ]
  }
}
```

---

## Development & Storybook

```bash
# Start Storybook locally (port 6006)
yarn storybook

# Build static Storybook site
yarn build-storybook

# Type check & build package
yarn build

# Format & Lint
yarn format
yarn lint
```
