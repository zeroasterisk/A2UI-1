/*
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {describe, it} from 'node:test';
import assert from 'node:assert/strict';
import {
  inferA2UIPropType,
  transformStoryToA2UISchema,
  generateAgentPromptSnippet,
} from './a2ui-transformer.js';
import type {StorybookStoryData} from '../types.js';

describe('A2UI Transformer', () => {
  it('correctly infers A2UI prop types from Storybook control definitions', () => {
    assert.equal(inferA2UIPropType({control: 'boolean'}), 'boolean');
    assert.equal(inferA2UIPropType({control: 'select', options: ['sm', 'md', 'lg']}), 'enum');
    assert.equal(inferA2UIPropType({control: 'number'}), 'number');
    assert.equal(inferA2UIPropType({control: 'text'}), 'string');
    assert.equal(inferA2UIPropType({control: 'action'}), 'action');
  });

  it('transforms Storybook story metadata into an A2UI component schema', () => {
    const mockStory: StorybookStoryData = {
      id: 'components-button--primary',
      name: 'Primary',
      title: 'Components/Button',
      parameters: {
        a2ui: {
          catalogId: 'design-system',
          componentName: 'Button',
        },
      },
      argTypes: {
        label: {control: 'text', description: 'Button text label'},
        variant: {
          control: 'select',
          options: ['primary', 'secondary', 'danger'],
          description: 'Visual intent variant',
        },
        disabled: {control: 'boolean', description: 'Disable button interactions'},
        onClick: {control: 'action'},
      },
      args: {
        label: 'Click Me',
        variant: 'primary',
        disabled: false,
      },
    };

    const schema = transformStoryToA2UISchema(mockStory);
    assert.equal(schema.id, 'design-system/Button');
    assert.equal(schema.name, 'Button');
    assert.equal(schema.catalog, 'design-system');
    assert.equal(schema.properties.label.type, 'string');
    assert.equal(schema.properties.variant.type, 'enum');
    assert.deepEqual(schema.properties.variant.options, ['primary', 'secondary', 'danger']);
    assert.equal(schema.properties.disabled.type, 'boolean');
    assert.equal(schema.properties.onClick.type, 'action');
  });

  it('generates a valid LLM multi-shot prompt snippet', () => {
    const mockStory: StorybookStoryData = {
      id: 'metric-card',
      name: 'Default',
      title: 'Components/MetricCard',
      argTypes: {
        title: {control: 'text'},
        value: {control: 'text'},
      },
    };

    const schema = transformStoryToA2UISchema(mockStory);
    const snippet = generateAgentPromptSnippet(schema, {title: 'Revenue', value: '$45,000'});

    assert.ok(snippet.includes('Component: MetricCard'));
    assert.ok(snippet.includes('"title": string'));
    assert.ok(snippet.includes('"value": string'));
    assert.ok(snippet.includes('$45,000'));
  });
});
