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

/**
 * A2UI Component definition matching tools/composer format.
 */
export type A2UIComponent = Record<string, unknown> & {
  id: string;
  component: string;
};

/**
 * DataState representing named test fixtures, matching tools/composer.
 */
export interface A2UIDataState {
  name: string;
  data: Record<string, unknown>;
}

export type SpecVersion = '0.8' | '0.9';

/**
 * A2UI Widget model identical to tools/composer/src/types/widget.ts
 */
export interface A2UIWidget {
  id: string;
  name: string;
  description?: string;
  root: string;
  specVersion: SpecVersion;
  components: A2UIComponent[];
  dataStates: A2UIDataState[];
}

/**
 * Standard A2UI v0.9 message protocol definition
 */
export interface A2UICreateSurfaceMessage {
  version: 'v0.9';
  createSurface: {
    surfaceId: string;
    catalogId: string;
  };
}

export interface A2UIUpdateComponentsMessage {
  version: 'v0.9';
  updateComponents: {
    surfaceId: string;
    components: A2UIComponent[];
  };
}

export interface A2UIUpdateDataModelMessage {
  version: 'v0.9';
  updateDataModel: {
    surfaceId: string;
    path: string;
    value: Record<string, unknown>;
  };
}

export type A2UIMessage =
  | A2UICreateSurfaceMessage
  | A2UIUpdateComponentsMessage
  | A2UIUpdateDataModelMessage;

export interface A2UIScenario {
  id: string;
  name: string;
  description: string;
  category: 'default' | 'stress' | 'edge-case' | 'warning' | 'custom';
  args: Record<string, unknown>;
  widget: A2UIWidget;
  messages: A2UIMessage[];
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
