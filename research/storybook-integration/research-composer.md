# A2UI Composer Architecture & Storybook Integration Points

This document provides an architectural analysis of the **A2UI Composer** and maps out the exact integration points where Storybook can be wired in.

---

## 1. Current Composer Architecture

The A2UI Composer (located in `tools/composer`) is a modern React/Next.js application built with Tailwind CSS. It is structured around the following key modules:

```
tools/composer/src/
├── app/                  # Next.js app router pages (widget editor, gallery, component docs)
├── components/           # UI elements (Sidebar, Widget Input, Editor Panels, Preview Pane)
├── contexts/             # State management (widgets, spec versioning)
├── data/                 # Sample gallery data (synced via sync-gallery.mjs)
├── lib/                  # Utilities, storage, transcoder, and A2UIViewer wrappers
└── types/                # TypeScript interfaces (A2UIComponent, Widget)
```

### The Component Catalog Browser (`app/components/page.tsx`)
Currently, the component documentation and visual previews are hardcoded in:
* `src/lib/components-data.ts` (for Spec v0.8)
* `src/lib/components-data-v09.ts` (for Spec v0.9)

These files export a static array `COMPONENTS_DATA: ComponentCategory[]` specifying the name, description, usage JSON snippet, property schemas, and a mock preview payload.

---

## 2. Strategic Integration Points for Storybook

Integrating Storybook into the A2UI Composer represents a major paradigm shift: moving from **static, manually maintained mocks** to **dynamic, code-driven visual assemblies**.

We have identified three strategic integration vectors:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             A2UI COMPOSER                                │
├─────────────────────┬──────────────────────────────┬─────────────────────┤
│  1. Catalog Sync    │     2. Live Preview          │    3. Prop Panel    │
│  (API Endpoint)     │     (Vite/Storybook iframe)  │    (Controls UI)    │
├─────────────────────┼──────────────────────────────┼─────────────────────┤
│ Storybook's index   │ Embeds Storybook iframe      │ Maps argTypes to    │
│ manifest parses     │ passing live props via       │ input sliders, color│
│ docgen & exports    │ postMessage / query params.   │ pickers, enum dropdowns│
│ A2UI Catalog JSON.  │                              │ dynamically.        │
└─────────────────────┴──────────────────────────────┴─────────────────────┘
```

### Integration Point 1: Dynamic Catalog Sync (The Schema Layer)
Instead of importing static arrays from `components-data.ts`, the Composer can ingest component schemas directly from a running Storybook instance or a built manifest.

* **Implementation:** Create a Next.js API route (e.g., `src/app/api/catalog/sync/route.ts`).
* **Behavior:** The route fetches Storybook's `/index.json` and parses the `argTypes` schema. It formats the data on-the-fly into the `ComponentCategory[]` format used by the component browser and visual editor.
* **Benefit:** Instant catalog updates. If a developer adds a new prop (e.g., `size: "sm" | "md" | "lg"`) to a button component in the core library, the property is immediately editable inside the A2UI Composer with no spec write needed.

---

### Integration Point 2: Visual Preview Frame Embedding (The Rendering Layer)
The current `A2UIViewer` is a static mock renderer. If components use intricate styles, fonts, or assets, the mock renderer will fail to represent them accurately.

* **Implementation:** Embed Storybook’s isolated canvas (`iframe.html`) directly inside the Composer's preview pane.
* **Mechanism:**
  ```tsx
  // inside src/components/editor/preview-pane.tsx
  const storyId = `components-${componentName.toLowerCase()}--default`;
  const storyUrl = `http://localhost:6006/iframe.html?id=${storyId}&viewMode=story&args=${serializeProps(props)}`;
  
  return <iframe src={storyUrl} className="w-full h-full border-0" />;
  ```
* **PostMessage Bridge:** For instantaneous updates without reloading the iframe, we can send messages over the Storybook Channel API:
  ```typescript
  const iframe = iframeRef.current;
  iframe.contentWindow.postMessage({
    type: 'storybook-channel-message',
    event: {
      type: 'updateGlobals',
      args: { theme: currentTheme }
    }
  }, '*');
  ```
* **Benefit:** 100% accurate visual rendering of the component exactly as it will appear in production, running the real compiled JS/CSS.

---

### Integration Point 3: Rich Prop Control Generator (The Low-Code Layer)
The current properties panel in the composer uses basic text fields. By leveraging Storybook's `argTypes` controls metadata, we can auto-render highly specialized input controls.

* **Mapping Controls:**
  * `type: "boolean"` $\rightarrow$ Sliders / Switches.
  * `type: "enum"` (with values) $\rightarrow$ Visual button groups or drop-down selects.
  * `type: "color"` (extracted via control annotations) $\rightarrow$ Native color pickers.
  * `type: "number"` (with min/max constraints) $\rightarrow$ Slider ranges.
* **Benefit:** Upgrades the A2UI Composer into a premium, robust, no-code visual builder where agents can easily hand off visual fine-tuning to humans.
