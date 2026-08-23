# Prototypes Proposal: Storybook & A2UI Integration

We propose a phased approach of three rapid, highly focused prototypes. This progression allows us to evaluate technical assumptions, refine the specification, and establish a fluid UX workflow without committing to any rigid greenfield codebase.

---

## Prototype 1: The Static Schema Syncer (The Foundation)

### Objective
Build a CLI compiler that reads Storybook metadata outputs and outputs a fully compliant A2UI Component Catalog JSON file, eliminating spec drift.

### Core Workflow
1. Run a sample Storybook build to generate `index.json` and component metadata documentation (`project.json` or `docgen.json`).
2. Write a lightweight node command `storybook-to-a2ui` (or python script).
3. The script:
   - Filters out non-component entries (docs, helpers).
   - Maps component configurations and their types to the A2UI spec.
   - Maps specific stories (`Primary`, `Disabled`, etc.) to A2UI example codeblocks.
4. Outputs `storybook-catalog.json`.

### Success Criteria
* Standard tools (like validators or AI assistants) can parse `storybook-catalog.json` with zero errors.
* Dynamic property changes in the source code are automatically reflected in the compiled catalog.

---

## Prototype 2: The Live Iframe Preview Channel (The Editor)

### Objective
Embed Storybook's rendering pipeline directly inside the A2UI Composer, using real design-system components instead of mockup components in the editor preview.

### Core Workflow
1. In the A2UI Composer (`tools/composer`), replace the static, mock-rendered `A2UIViewer` with an interactive iframe tracking the local Storybook preview server (`http://localhost:6006/iframe.html`).
2. Implement a Next.js component `<StorybookPreview />` that takes the selected component name and current prop state.
3. Establish a postMessage message channel:
   - When the user edits props in the Composer's properties panel, the Composer sends an `update` payload to the Storybook iframe.
   - Inside Storybook, a custom decorator listens for the postMessage event and calls Storybook's `updateArgs()` hook to re-render the live component instantly without reloading.

### Success Criteria
* Fluid, sub-100ms prop update previews inside the Composer canvas.
* Accurate styling, animations, and assets matching the production design system exactly.

---

## Prototype 3: The Higher-Order Template Composer (The Game Changer)

### Objective
Specify and build the "Templates" layer, allowing the Composer and AI Agents to assemble layouts using higher-order, pre-configured composite widgets.

### Core Workflow
1. Define a set of 3 high-level visual templates in Storybook (e.g., `MetricCard`, `ActivityFeedItem`, `QuickForm`).
2. Formulate the JSON specification (`template.json`) detailing inputs and visual layout bindings for these templates.
3. Update the Composer transcoder and parser:
   - The agent outputs a clean, high-level template invocation (e.g., `{ "component": "MetricCard", "props": { "title": "Sales", "value": "$9k" } }`).
   - The transcoder automatically inflates this call into its low-level A2UI primitives (Row, Column, Text, etc.) before feeding it to the basic renderer, OR:
   - The renderer directly resolves the high-level template call using its compiled Storybook visual equivalent.

### Success Criteria
* AI agents can build complex screens using 80% fewer tokens with a 10x speedup in parsing and validation.
* The Composer UI allows users to easily toggle between editing high-level template properties and diving into low-level primitive overrides.
