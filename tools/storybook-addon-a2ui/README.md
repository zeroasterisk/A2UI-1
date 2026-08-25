# A2UI Storybook Addon (`@a2ui/storybook-addon`)

Drive, test, and author **Generative UI components** with AI agents directly inside **Storybook**.

The **A2UI Storybook Addon** embeds an interactive A2UI agent panel in your Storybook dock, allowing frontend developers and designers to:

1. **Simulate Agent Scenarios**: Test edge cases (stress content, empty states, error badges) with 1 click.
2. **Interactive Agent Prompting**: Type natural-language instructions to generate live component prop variations on the fly.
3. **Automatic Catalog Generation**: Transpile Storybook `argTypes` into compliant **A2UI Component Catalog schemas**.
4. **Copy-as-Prompt**: Instantly export deterministic multi-shot prompt examples for Gemini, Claude, or ADK agents.

---

## Installation

Add `@a2ui/storybook-addon` to your Storybook configuration:

```bash
yarn add -D @a2ui/storybook-addon
# or
npm install -D @a2ui/storybook-addon
```

### Enable in `.storybook/main.ts`

```typescript
import type {StorybookConfig} from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@a2ui/storybook-addon', // <-- Add here
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

---

## Features

### 1. Scenarios & Edge-Case Simulator

The addon analyzes your component's `argTypes` and automatically synthesizes:

- **Baseline Preset**: The default story props.
- **Stress Test**: Long multi-line text strings and boundary numbers to test layout overflow.
- **Empty / Minimal State**: Zero values, empty strings, and disabled flags.
- **Alert / Warning State**: Activates destructive or warning variants automatically.

### 2. Live Agent Chat & Vibe-Coding

Type prompts like:

> _"Change the button variant to destructive and label to 'Cancel Flight'"_  
> _"Simulate a flight delayed by 3 hours with a gate change"_

The addon simulates or queries the agent, generates a compliant A2UI `surfaceUpdate` message, and calls `api.updateStoryArgs()` to hot-reload your canvas live.

### 3. A2UI Catalog Schema Inspector

View the exact JSON schema representation of your component according to the **A2UI v0.9.1 / v1.0 specification**. Copy the schema or copy the prompt snippet directly into your agent's system prompt.

---

## Customizing Story Scenarios

You can define bespoke scenarios directly on any story's parameters:

```tsx
import type {Meta, StoryObj} from '@storybook/react';
import {FlightCard} from './FlightCard';

const meta: Meta<typeof FlightCard> = {
  title: 'Components/FlightCard',
  component: FlightCard,
  parameters: {
    a2ui: {
      catalogId: 'travel-catalog',
      componentName: 'FlightCard',
      scenarios: [
        {
          id: 'boarding-soon',
          name: 'Boarding Now',
          description: 'Flight is boarding at Gate B12.',
          category: 'default',
          args: {status: 'Boarding', gate: 'B12'},
        },
      ],
    },
  },
};
export default meta;
```

---

## License

Apache-2.0
