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

export const ADDON_ID = 'a2ui';
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = 'a2ui';

export const EVENTS = {
  UPDATE_STORY_ARGS: 'storybook/core/updateStoryArgs',
  SET_STORY_ARGS: 'storybook/core/setStoryArgs',
  STORY_ARGS_UPDATED: 'storybook/core/storyArgsUpdated',
  A2UI_PAYLOAD_GENERATED: `${ADDON_ID}/payloadGenerated`,
  A2UI_SCENARIO_SELECTED: `${ADDON_ID}/scenarioSelected`,
  A2UI_CATALOG_EXPORT: `${ADDON_ID}/catalogExport`,
} as const;
