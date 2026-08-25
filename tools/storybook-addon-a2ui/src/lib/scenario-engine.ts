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

import type {A2UIScenario, StorybookStoryData} from '../types.js';
import {transformStoryToA2UISchema} from './a2ui-transformer.js';

function wrapInA2UIPayload(componentName: string, args: Record<string, unknown>) {
  return {
    surfaceUpdate: {
      surfaceId: 'default',
      components: [
        {
          id: `${componentName.toLowerCase()}-instance-1`,
          component: componentName,
          props: args,
        },
      ],
    },
  };
}

/**
 * Automatically synthesizes testing scenarios from a Storybook story's argTypes and initial args
 */
export function generateScenariosForStory(story: StorybookStoryData): A2UIScenario[] {
  // If story authors provided custom A2UI scenarios in parameters, use those first
  if (story.parameters?.a2ui?.scenarios && story.parameters.a2ui.scenarios.length > 0) {
    return story.parameters.a2ui.scenarios;
  }

  const schema = transformStoryToA2UISchema(story);
  const currentArgs = (story.args || story.initialArgs || {}) as Record<string, unknown>;
  const componentName = schema.name;
  const scenarios: A2UIScenario[] = [];

  // 1. Default Scenario
  scenarios.push({
    id: 'default',
    name: 'Default Baseline',
    description: 'Current story baseline arguments as authored in Storybook.',
    category: 'default',
    args: {...currentArgs},
    a2uiPayload: wrapInA2UIPayload(componentName, currentArgs),
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
  scenarios.push({
    id: 'stress-content',
    name: 'Stress Test: Long Content',
    description: 'Verifies typography wrapping, label truncation, and container overflow.',
    category: 'stress',
    args: stressArgs,
    a2uiPayload: wrapInA2UIPayload(componentName, stressArgs),
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
  scenarios.push({
    id: 'minimal-empty',
    name: 'Minimal / Empty State',
    description: 'Verifies behavior with empty strings, zero values, and false flags.',
    category: 'edge-case',
    args: emptyArgs,
    a2uiPayload: wrapInA2UIPayload(componentName, emptyArgs),
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
    scenarios.push({
      id: 'alert-state',
      name: 'Alert / Error State',
      description: 'Activates destructive variants, error badges, or disabled states.',
      category: 'warning',
      args: alertArgs,
      a2uiPayload: wrapInA2UIPayload(componentName, alertArgs),
    });
  }

  return scenarios;
}
