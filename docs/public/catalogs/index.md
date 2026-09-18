# A2UI Catalogs & Design Systems

In A2UI, an **A2UI Catalog** defines the visual vocabulary of components, properties, and interactions that an AI agent is permitted to render on a user interface surface.

Every surface created by an agent is negotiated against a specific catalog schema:
```json
{
  "createSurface": {
    "surfaceId": "main-view",
    "catalogId": "urn:a2ui:catalog:shadcn"
  }
}
```

---

## The Catalog Spectrum: From Minimal to Rich

A2UI approaches design systems through a spectrum:

```
[ Minimal & Universal ]  ───────────────────────────────────────────►  [ Rich & Opinionated ]
     Basic Catalog                                                          ShadCN UI Catalog
(Text, Row, Column, Button)                                           (Charts, Drawers, Sidebars, Forms)
  Portable across Lit, Angular,                                         Modern, complete SaaS UI ready
  React, Flutter, Android, iOS                                          for complex autonomous agent apps
```

### 1. The Basic Catalog (Protocol Anchor)
The [Basic Catalog](../specification/v0.9.1-basic-catalog-implementation-guide.md) is intentionally minimal. It provides universal primitives (`Text`, `Button`, `Row`, `Column`, `Card`, `Image`, `TextField`) that can be implemented cleanly across every target language and native platform (Flutter, Swift, Kotlin, Lit, React). It is the reference implementation for protocol conformance.

### 2. Pre-Built Reference Catalogs (Jump-Starts)
Real-world enterprise and SaaS applications demand more than primitive rows and columns. They require **data-dense, modern components**:
- Data tables with sorting and pagination
- Interactive analytical charts (bar, line, pie, area)
- Multi-step forms with client-side validation
- Drawers, slide-over sheets, popovers, and context menus
- Collapsible navigation sidebars and command palettes

To ensure developers can ship production-grade agent interfaces immediately without building custom renderers from scratch, A2UI maintains **pre-built reference catalogs**:

- **[ShadCN UI Catalog](shadcn.md)**: 53 modern primitives powered by Radix UI, Tailwind CSS, and Recharts, with a full Storybook 8 suite.
- *(Upcoming)* **Material Design Catalog**: Cross-platform Material 3 catalog for web, mobile, and Flutter.
- *(Upcoming)* **Tailwind UI Catalog**: Utility-first composable layouts.

These pre-built catalogs are **batteries-included references**: you can use them directly out of the box, fork them to customize your theme, or use them as an architectural blueprint.

---

## Bring Your Own Design System (BYODS)

The most important tenet of A2UI is that **you are never locked into our components**:

> **A2UI was designed from the ground up to adapt to *your* design system — not force you into ours.**

If your team already maintains a component library in React, Lit, Angular, Vue, or Web Components (or a Storybook collection), exposing it to AI agents requires only three straightforward steps:

1. **Define the Schema:** Create a JSON Schema declaring the components and props your agent may use.
2. **Register the Renderers:** Map the schema component names to your existing frontend components.
3. **Announce Support:** Include your `catalogId` in your client capabilities so the agent knows what visual tools it has available.

Read the **[Bring Your Own Design System Guide](bring-your-own-design-system.md)** to see how to connect any component library to A2UI in minutes.
