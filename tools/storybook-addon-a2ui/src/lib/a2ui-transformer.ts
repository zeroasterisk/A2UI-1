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
  A2UIComponentSchema,
  A2UIPropDefinition,
  A2UIPropType,
  StorybookStoryData,
} from '../types.js';

interface RawArgType {
  name?: string;
  description?: string;
  defaultValue?: unknown;
  type?: {
    name?: string;
    value?: unknown;
    raw?: string;
  };
  control?:
    | string
    | {
        type?: string;
        options?: string[];
      };
  options?: string[];
}

/**
 * Infer A2UI prop type from Storybook argType definition
 */
export function inferA2UIPropType(argType: RawArgType): A2UIPropType {
  const controlType = typeof argType.control === 'string' ? argType.control : argType.control?.type;
  const typeName = argType.type?.name?.toLowerCase();

  if (controlType === 'boolean' || typeName === 'boolean') {
    return 'boolean';
  }
  if (
    controlType === 'select' ||
    controlType === 'radio' ||
    controlType === 'inline-radio' ||
    Array.isArray(argType.options) ||
    Array.isArray(
      argType.control && typeof argType.control === 'object' ? argType.control.options : undefined,
    )
  ) {
    return 'enum';
  }
  if (controlType === 'number' || controlType === 'range' || typeName === 'number') {
    return 'number';
  }
  if (controlType === 'object' || typeName === 'object') {
    return 'object';
  }
  if (controlType === 'action' || typeName?.includes('function') || typeName?.includes('void')) {
    return 'action';
  }
  return 'string';
}

/**
 * Transform Storybook story metadata into an A2UI Component Schema
 */
export function transformStoryToA2UISchema(story: StorybookStoryData): A2UIComponentSchema {
  const componentName =
    story.parameters?.a2ui?.componentName ||
    story.title.split('/').pop() ||
    story.name ||
    'CustomComponent';

  const catalog = story.parameters?.a2ui?.catalogId || 'storybook-catalog';
  const properties: Record<string, A2UIPropDefinition> = {};

  if (story.argTypes) {
    for (const [key, raw] of Object.entries(story.argTypes)) {
      if (key.startsWith('__')) continue;
      const argType = raw as RawArgType;
      const propType = inferA2UIPropType(argType);
      const options =
        argType.options ||
        (argType.control && typeof argType.control === 'object'
          ? argType.control.options
          : undefined);

      properties[key] = {
        name: key,
        type: propType,
        description: argType.description,
        defaultValue: argType.defaultValue,
        options,
      };
    }
  }

  return {
    id: `${catalog}/${componentName}`,
    name: componentName,
    description: `Storybook component mapped to A2UI (${story.title})`,
    catalog,
    properties,
  };
}

/**
 * Generate an LLM-ready system prompt snippet for an A2UI component
 */
export function generateAgentPromptSnippet(
  schema: A2UIComponentSchema,
  sampleArgs: Record<string, unknown>,
): string {
  const propsList = Object.entries(schema.properties)
    .map(([key, def]) => {
      let typeDesc = def.type as string;
      if (def.options && def.options.length > 0) {
        typeDesc = def.options.map(o => `"${o}"`).join(' | ');
      }
      return `    "${key}": ${typeDesc}${def.description ? ` // ${def.description}` : ''}`;
    })
    .join('\n');

  const exampleCall = {
    component: schema.name,
    props: sampleArgs,
  };

  return `### Component: ${schema.name}
Catalog: ${schema.catalog}
Props Schema:
{
${propsList}
}

Example Agent Call:
${JSON.stringify(exampleCall, null, 2)}`;
}
