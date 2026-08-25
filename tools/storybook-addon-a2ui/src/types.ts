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

export interface A2UIScenario {
  id: string;
  name: string;
  description: string;
  category: 'default' | 'stress' | 'edge-case' | 'warning' | 'custom';
  args: Record<string, unknown>;
  a2uiPayload: {
    surfaceUpdate: {
      surfaceId: string;
      components: Array<{
        id: string;
        component: string;
        props: Record<string, unknown>;
      }>;
    };
  };
}

export type A2UIPropType = 'string' | 'number' | 'boolean' | 'enum' | 'object' | 'action';

export interface A2UIPropDefinition {
  name: string;
  type: A2UIPropType;
  description?: string;
  options?: string[];
  defaultValue?: unknown;
  required?: boolean;
}

export interface A2UIComponentSchema {
  id: string;
  name: string;
  description?: string;
  catalog: string;
  properties: Record<string, A2UIPropDefinition>;
}

export interface A2UIParameterConfig {
  catalogId?: string;
  componentName?: string;
  scenarios?: A2UIScenario[];
  disableAddon?: boolean;
}

export interface StorybookStoryData {
  id: string;
  name: string;
  title: string;
  parameters?: {
    a2ui?: A2UIParameterConfig;
    [key: string]: unknown;
  };
  argTypes?: Record<string, unknown>;
  args?: Record<string, unknown>;
  initialArgs?: Record<string, unknown>;
}

export interface StorybookManagerApi {
  getCurrentStoryData: () => StorybookStoryData | null | undefined;
  updateStoryArgs: (story: StorybookStoryData, newArgs: Record<string, unknown>) => void;
  getChannel?: () => {
    emit: (event: string, ...args: unknown[]) => void;
    on: (event: string, listener: (...args: unknown[]) => void) => void;
    off: (event: string, listener: (...args: unknown[]) => void) => void;
  };
}
