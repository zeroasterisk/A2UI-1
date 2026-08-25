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

import {ADDON_ID, PANEL_ID} from './constants.js';
import {A2UIPanel} from './components/A2UIPanel.js';
import type {StorybookManagerApi} from './types.js';

/**
 * Self-registering manager bundle for Storybook
 */
async function initManager() {
  try {
    const {addons, types} = await import('@storybook/manager-api');
    addons.register(ADDON_ID, (api: unknown) => {
      addons.add(PANEL_ID, {
        type: types.PANEL,
        title: 'A2UI Composer',
        match: ({viewMode}: {viewMode?: string}) => viewMode === 'story',
        render: ({active}: {active?: boolean}) => (
          <A2UIPanel active={active} api={api as StorybookManagerApi} />
        ),
      });
    });
  } catch {
    // Fallback for global window registration
    if (
      typeof window !== 'undefined' &&
      (
        window as unknown as {
          __STORYBOOK_ADDONS__?: {
            register: (id: string, cb: (api: StorybookManagerApi) => void) => void;
            add: (id: string, opts: unknown) => void;
          };
        }
      ).__STORYBOOK_ADDONS__
    ) {
      const globalAddons = (
        window as unknown as {
          __STORYBOOK_ADDONS__: {
            register: (id: string, cb: (api: StorybookManagerApi) => void) => void;
            add: (id: string, opts: unknown) => void;
          };
        }
      ).__STORYBOOK_ADDONS__;
      globalAddons.register(ADDON_ID, (api: StorybookManagerApi) => {
        globalAddons.add(PANEL_ID, {
          type: 100, // types.PANEL
          title: 'A2UI Composer',
          match: ({viewMode}: {viewMode?: string}) => viewMode === 'story',
          render: ({active}: {active?: boolean}) => <A2UIPanel active={active} api={api} />,
        });
      });
    }
  }
}

initManager();

export {A2UIPanel};
