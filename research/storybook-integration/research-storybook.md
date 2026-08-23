# Storybook Metadata & Extensibility Research

Storybook is the industry standard for developing and documenting components in isolation. This document outlines how Storybook can be programmatically queried, compiled, and analyzed to serve as the unified source of truth for the A2UI ecosystem.

---

## 1. Storybook Metadata Pipelines

To utilize Storybook as a source of truth, we must extract two distinct tiers of data:
1. **The Navigation Index:** What components and states (stories) exist.
2. **The Component Schema:** What properties (props), types, and defaults each component accepts.

### A. The Navigation Index (`index.json`)
Storybook 7+ produces a highly structured index file during compilation, also served at `/index.json` (or `/stories.json` in older versions) during local development.

**Structure of `index.json`:**
```json
{
  "v": 4,
  "entries": {
    "components-button--primary": {
      "id": "components-button--primary",
      "title": "Components/Button",
      "name": "Primary",
      "importPath": "./src/components/Button.tsx",
      "tags": ["autodocs", "story"],
      "type": "story"
    },
    "components-button--disabled": {
      "id": "components-button--disabled",
      "title": "Components/Button",
      "name": "Disabled",
      "importPath": "./src/components/Button.tsx",
      "tags": ["story"],
      "type": "story"
    }
  }
}
```
* **Relevance to A2UI:** Each component title (e.g., `Components/Button`) maps to an A2UI Catalog Component. Each individual story (e.g., `components-button--primary`) represents a valid pre-configured state, which directly maps to **A2UI Catalog Examples/Previews**.

---

### B. The Component Schema (Docgen & ArgTypes)
Storybook uses `react-docgen` or `react-docgen-typescript` (under Webpack or Vite) to statically analyze source code. It extracts:
* Prop names & descriptions (from JSDoc comments).
* Prop types (TypeScript unions, interfaces, primitive types).
* Default values.

This data is attached to the component's story metadata under `argTypes`.

#### Extracting Schema at Build Time (Static Pipeline)
We can extract full typescript type metadata by querying the `argTypes` or by running `react-docgen-typescript` directly as a pre-build CLI step.

**Example `react-docgen` Output:**
```json
{
  "src/components/Button.tsx": [
    {
      "description": "Button display variant",
      "displayName": "Button",
      "methods": [],
      "props": {
        "variant": {
          "defaultValue": { "value": "'primary'" },
          "description": "Visual style of the button",
          "required": false,
          "type": { "name": "enum", "value": [
            { "value": "'primary'" },
            { "value": "'secondary'" },
            { "value": "'danger'" }
          ]}
        },
        "disabled": {
          "defaultValue": { "value": "false" },
          "description": "Disables interactions",
          "required": false,
          "type": { "name": "boolean" }
        }
      }
    }
  ]
}
```
* **Relevance to A2UI:** This maps directly to **A2UI Catalog Component Props**. We can parse this output to automatically generate the `props` array in `COMPONENTS_DATA` (or its v1.0 JSON equivalent), guaranteeing that the AI agent or visual editor uses exactly the supported properties with zero manual spec maintenance.

#### Extracting Schema at Runtime (Dynamic Pipeline)
If Storybook is running, we can query its Client API or use the Storybook frame to extract compiled `argTypes` dynamically:
```javascript
// From within a browser context or via Playwright
const preview = window.__STORYBOOK_PREVIEW__;
const storyStore = preview.storyStore;
const story = storyStore.fromId('components-button--primary');
console.log(story.argTypes); // Returns fully populated controls and schemas
```

---

## 2. Component Story Format (CSF 3) as A2UI Templates

Storybook’s CSF 3 format is declarative and maps incredibly well to high-level A2UI configurations.

**CSF 3 Story Example (`Button.stories.tsx`):**
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] }
  }
};
export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: {
    variant: 'primary',
    children: 'Confirm Action'
  }
};
```

### Mapping CSF to A2UI Structure

| Storybook (CSF 3) | A2UI Component Specification | Purpose |
| :--- | :--- | :--- |
| `meta.title` | Component Name (`"Button"`) | Identifies the component in the catalog. |
| `meta.argTypes` | `props: ComponentProp[]` | Exposes editable controls in Composer property panels. |
| `export const [Name]` | A2UI Preset / Example | Quick-start UI snippet for agents. |
| `story.args` | Pre-configured property values | Default configuration of a specific variant or template. |

---

## 3. Key Research Findings & Opportunities

1. **Deterministic Up-to-Date Catalogs:** Instead of developers writing A2UI Catalog JSON specifications manually and then letting them drift from the actual renderer code, the Storybook static build pipeline can auto-generate A2UI Catalog JSON on every commit.
2. **Visual Frame Embedding:** The A2UI Composer's preview canvas can iframe Storybook's `iframe.html?id=[story-id]&viewMode=story` directly. This eliminates the need to build a custom renderer inside the composer, leveraging the actual live React/Angular/Lit components running in Storybook.
3. **The Playwright Snapshot Pipeline:** Since Storybook isolates components, we can run headless Playwright scripts during the build to capture visual snapshots of every story, updating the A2UI Composer's component browser with real, current screenshots.
