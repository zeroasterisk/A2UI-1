# ShadCN UI Catalog (`@a2ui/catalog-shadcn`)

The **ShadCN UI Catalog** is a rich, modern A2UI component catalog providing 53 primitives built on top of Radix UI, Tailwind CSS, Lucide icons, and Recharts.

It includes:
- **A2UI Catalog JSON Schema (`catalog.json`)** defining types, properties, and constraints for agent prompting and wire validation.
- **React Component Implementations** matching official ShadCN UI designs.
- **Interactive Storybook 8 Workbench** with 149 individual stories, autodocs, and visual testing capabilities.

---

## Catalog Information

- **Catalog ID:** `https://a2ui.org/catalogs/shadcn/catalog.json` (alias: `urn:a2ui:catalog:shadcn`)
- **Protocol Versions:** v0.9, v0.9.1, v1.0
- **Workspace Location:** `catalogs/shadcn`
- **Package Name:** `@a2ui/catalog-shadcn`

---

## Component Catalog (53 Primitives)

### Actions & Triggers
- **`Button`**: Primary, secondary, destructive, outline, ghost, link variants, and size options.
- **`ButtonGroup`**: Horizontal and vertical groups for closely related actions.
- **`Toggle`**: Two-state pressable button for toggling options.
- **`ToggleGroup`**: Group of single- or multi-select toggle buttons.

### Forms & Input Controls
- **`Input`**: Text, password, email, number, search inputs.
- **`InputGroup`**: Enhanced inputs with embedded icons, prefix/suffix text, or action buttons.
- **`InputOTP`**: Accessible one-time password and PIN entry slots.
- **`Textarea`**: Multi-line text field with dynamic resizing.
- **`Checkbox`**: Binary and indeterminate checkbox controls with labels.
- **`RadioGroup`**: Mutually exclusive options list.
- **`Select`**: Native-feeling dropdown selection menu.
- **`Slider`**: Numeric range slider with single and range handles.
- **`Switch`**: Smooth toggle switch for binary preferences.
- **`Calendar`**: Day and date range picker powered by `react-day-picker`.
- **`Field`**: Structured field layout combining label, input, description, and validation errors.
- **`Form`**: Complete form management container with React Hook Form validation.

### Layout & Containers
- **`Card`**: Structured card container with header, title, description, content, and footer slots.
- **`Accordion`**: Vertically stacked collapsible disclosure panels (single or multiple).
- **`Tabs`**: Segmented tabbed views for switching between content panels.
- **`Collapsible`**: Expandable disclosure section with trigger control.
- **`Separator`**: Horizontal and vertical visual divider lines.
- **`ScrollArea`**: Custom styled cross-browser scrollable viewport.
- **`Resizable`**: Drag-to-resize split view panel layouts.
- **`Table`**: Structured tabular data presentation with headers, rows, and captions.
- **`Item`**: Reusable list item with icon/avatar, title, subtitle, and action buttons.
- **`Empty`**: Empty state container with illustration/icon, message, and call-to-action button.

### Overlays, Feedback & Modals
- **`Dialog`**: Modal window overlay for user workflows.
- **`AlertDialog`**: Critical confirmation dialog requiring explicit user confirmation.
- **`Drawer`**: Mobile-friendly sheet sliding up from the bottom edge.
- **`Sheet`**: Slide-out drawer panel entering from any screen edge (left, right, top, bottom).
- **`Popover`**: Floating content container anchored to a trigger element.
- **`Tooltip`**: Brief contextual text appearing on hover or focus.
- **`HoverCard`**: Rich preview card displayed on link or element hover.
- **`ContextMenu`**: Custom right-click contextual action menu.
- **`DropdownMenu`**: Action menu triggered by a button or icon.
- **`Menubar`**: Persistent desktop-style horizontal application menu.
- **`Alert`**: Prominent callout banners (default and destructive styles).
- **`Sonner`**: High-performance toast notification system for action feedback.

### Navigation
- **`Breadcrumb`**: Hierarchical navigation breadcrumb trail.
- **`NavigationMenu`**: Multi-level navigation dropdown bar with viewports.
- **`Pagination`**: Page navigation with previous/next controls and ellipsis indicators.
- **`Sidebar`**: Composable application sidebar with collapsible groups, navigation menus, and header/footer sections.

### Data Display, Media & Utility
- **`Avatar`**: User profile picture with automatic fallback initials.
- **`Badge`**: Status indicators, category tags, and pill counters.
- **`Progress`**: Linear progress bar indicator with percentage tracking.
- **`Skeleton`**: Animated loading placeholder shapes.
- **`Spinner`**: Indeterminate activity spinner.
- **`Kbd`**: Stylized keyboard shortcut keycaps (`⌘K`, `Shift`, `Enter`).
- **`AspectRatio`**: Aspect ratio container preserving media dimensions.
- **`Chart`**: Responsive analytics charts (bar, line, area, pie) powered by Recharts.

---

## Agent Usage Example

### 1. Surface Creation
When initiating a session, the client advertises support for `urn:a2ui:catalog:shadcn`. The agent creates a surface declaring this catalog:

```json
{
  "createSurface": {
    "surfaceId": "analytics-summary",
    "catalogId": "urn:a2ui:catalog:shadcn"
  }
}
```

### 2. Rendering a Dashboard Card with Chart & Actions
The agent then streams the UI component hierarchy using ShadCN primitives:

```json
{
  "updateComponents": {
    "surfaceId": "analytics-summary",
    "components": [
      {
        "id": "root-card",
        "component": "Card",
        "title": "Quarterly User Growth",
        "description": "Active users month-over-month",
        "content": "growth-chart",
        "footer": "action-row"
      },
      {
        "id": "growth-chart",
        "component": "Chart",
        "type": "bar",
        "data": [
          { "month": "Jan", "desktop": 186, "mobile": 80 },
          { "month": "Feb", "desktop": 305, "mobile": 200 },
          { "month": "Mar", "desktop": 237, "mobile": 120 }
        ]
      },
      {
        "id": "action-row",
        "component": "ButtonGroup",
        "children": ["export-btn", "filter-btn"]
      },
      {
        "id": "export-btn",
        "component": "Button",
        "text": "Export CSV",
        "variant": "outline",
        "size": "sm",
        "action": {
          "event": {
            "name": "exportData",
            "context": { "format": "csv" }
          }
        }
      },
      {
        "id": "filter-btn",
        "component": "Button",
        "text": "View Details",
        "variant": "default",
        "size": "sm"
      }
    ]
  }
}
```

---

## Local Development & Storybook

You can run and explore the full ShadCN Storybook suite locally from the root of the A2UI repository:

```bash
# Launch interactive Storybook dev server
yarn workspace @a2ui/catalog-shadcn storybook

# Build static Storybook site
yarn workspace @a2ui/catalog-shadcn build-storybook
```

Storybook serves at `http://localhost:6006` with full interactive controls, prop editors, autodocs, and dark mode toggles.
