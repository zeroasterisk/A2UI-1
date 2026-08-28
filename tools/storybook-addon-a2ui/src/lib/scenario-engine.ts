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

import type {
  A2UIComponent,
  A2UIMessage,
  A2UIScenario,
  A2UIWidget,
  StorybookStoryData,
} from '../types.js';
import {transformStoryToA2UISchema} from './a2ui-transformer.js';

const DEFAULT_CATALOG_ID = 'https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json';

/**
 * Creates standard A2UI v0.9 messages matching tools/composer / v09Viewer.tsx
 */
export function buildV09Messages(
  surfaceId: string,
  catalogId: string,
  rootId: string,
  components: A2UIComponent[],
  data?: Record<string, unknown>,
): A2UIMessage[] {
  const messages: A2UIMessage[] = [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId,
        catalogId,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components: components.map(c => (c.id === rootId ? {...c, id: 'root'} : c)),
      },
    },
  ];

  if (data && Object.keys(data).length > 0) {
    messages.push({
      version: 'v0.9',
      updateDataModel: {
        surfaceId,
        path: '/',
        value: data,
      },
    });
  }

  return messages;
}

/**
 * Builds an A2UI Widget representation matching tools/composer format
 */
export function buildA2UIWidget(
  componentName: string,
  args: Record<string, unknown>,
  stateName = 'default',
): A2UIWidget {
  const rootId = 'root';
  const componentInstance: A2UIComponent = {
    id: rootId,
    component: componentName,
    ...args,
  };

  return {
    id: `${componentName.toLowerCase()}-widget`,
    name: componentName,
    specVersion: '0.9',
    root: rootId,
    components: [componentInstance],
    dataStates: [
      {
        name: stateName,
        data: args,
      },
    ],
  };
}

/**
 * Automatically synthesizes testing scenarios from a Storybook story's argTypes and initial args
 */
export function generateScenariosForStory(story: StorybookStoryData): A2UIScenario[] {
  if (story.parameters?.a2ui?.scenarios && story.parameters.a2ui.scenarios.length > 0) {
    return story.parameters.a2ui.scenarios;
  }

  const schema = transformStoryToA2UISchema(story);
  const currentArgs = (story.args || story.initialArgs || {}) as Record<string, unknown>;
  const componentName = schema.name;
  const catalogId = story.parameters?.a2ui?.catalogId || DEFAULT_CATALOG_ID;
  const scenarios: A2UIScenario[] = [];

  // 1. Default Scenario
  const defaultWidget = buildA2UIWidget(componentName, currentArgs, 'default');
  scenarios.push({
    id: 'default',
    name: 'Default Baseline',
    description: 'Current story baseline arguments as authored in Storybook.',
    category: 'default',
    args: {...currentArgs},
    widget: defaultWidget,
    messages: buildV09Messages(
      'storybook-surface',
      catalogId,
      'root',
      defaultWidget.components,
      currentArgs,
    ),
  });

  // 2. Stress Test Scenario (Long strings, large numbers)
  const stressArgs: Record<string, unknown> = {...currentArgs};
  for (const [propName, propDef] of Object.entries(schema.properties)) {
    if (propDef.type === 'string') {
      const orig = String(currentArgs[propName] || propName);
      stressArgs[propName] =
        `${orig} — The quick brown fox jumps over the lazy dog repeatedly to test multi-line text wrapping and container overflow boundaries.`;
    } else if (propDef.type === 'number') {
      stressArgs[propName] = 999999;
    }
  }
  const stressWidget = buildA2UIWidget(componentName, stressArgs, 'stress-state');
  scenarios.push({
    id: 'stress-content',
    name: 'Stress Test: Long Content',
    description: 'Verifies typography wrapping, label truncation, and container overflow.',
    category: 'stress',
    args: stressArgs,
    widget: stressWidget,
    messages: buildV09Messages(
      'storybook-surface',
      catalogId,
      'root',
      stressWidget.components,
      stressArgs,
    ),
  });

  // 3. Empty / Minimal State
  const emptyArgs: Record<string, unknown> = {...currentArgs};
  for (const [propName, propDef] of Object.entries(schema.properties)) {
    if (propDef.type === 'string') {
      emptyArgs[propName] = '';
    } else if (propDef.type === 'number') {
      emptyArgs[propName] = 0;
    } else if (propDef.type === 'boolean') {
      emptyArgs[propName] = false;
    }
  }
  const emptyWidget = buildA2UIWidget(componentName, emptyArgs, 'empty-state');
  scenarios.push({
    id: 'minimal-empty',
    name: 'Minimal / Empty State',
    description: 'Verifies behavior with empty strings, zero values, and false flags.',
    category: 'edge-case',
    args: emptyArgs,
    widget: emptyWidget,
    messages: buildV09Messages(
      'storybook-surface',
      catalogId,
      'root',
      emptyWidget.components,
      emptyArgs,
    ),
  });

  // 4. Alert / Warning / Error State
  const alertArgs: Record<string, unknown> = {...currentArgs};
  let hasAlertProp = false;
  for (const [propName, propDef] of Object.entries(schema.properties)) {
    const lower = propName.toLowerCase();
    if (propDef.type === 'enum' && propDef.options) {
      const dangerOption = propDef.options.find(opt =>
        /danger|destructive|error|warning|critical|delay|cancel|alert|failed|offline/i.test(opt),
      );
      if (dangerOption) {
        alertArgs[propName] = dangerOption;
        hasAlertProp = true;
      }
    }
    if (/disabled|error|haserror|isinvalid|critical/i.test(lower)) {
      alertArgs[propName] = true;
      hasAlertProp = true;
    }
  }

  if (hasAlertProp) {
    const alertWidget = buildA2UIWidget(componentName, alertArgs, 'alert-state');
    scenarios.push({
      id: 'alert-state',
      name: 'Alert / Error State',
      description: 'Activates destructive variants, error badges, or disabled states.',
      category: 'warning',
      args: alertArgs,
      widget: alertWidget,
      messages: buildV09Messages(
        'storybook-surface',
        catalogId,
        'root',
        alertWidget.components,
        alertArgs,
      ),
    });
  }

  return scenarios;
}
