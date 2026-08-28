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
import {generateScenariosForStory, buildV09Messages, buildA2UIWidget} from './scenario-engine.js';
import type {StorybookStoryData} from '../types.js';

describe('Scenario Engine', () => {
  it('builds valid v0.9 A2UI messages matching tools/composer', () => {
    const messages = buildV09Messages(
      'test-surface',
      'https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json',
      'btn-1',
      [{id: 'btn-1', component: 'Button', text: 'Submit'}],
      {title: 'Test Data'},
    );

    assert.equal(messages.length, 3);
    const m0 = messages[0];
    const m1 = messages[1];
    const m2 = messages[2];
    if ('createSurface' in m0) {
      assert.equal(m0.createSurface.surfaceId, 'test-surface');
    } else {
      assert.fail('Expected createSurface message');
    }
    if ('updateComponents' in m1) {
      assert.equal(m1.updateComponents.components[0].id, 'root');
    } else {
      assert.fail('Expected updateComponents message');
    }
    if ('updateDataModel' in m2) {
      assert.equal(m2.updateDataModel.path, '/');
    } else {
      assert.fail('Expected updateDataModel message');
    }
  });

  it('builds an A2UI widget structure matching tools/composer', () => {
    const widget = buildA2UIWidget('FlightCard', {flight: 'AA123', gate: 'B4'});
    assert.equal(widget.name, 'FlightCard');
    assert.equal(widget.specVersion, '0.9');
    assert.equal(widget.root, 'root');
    assert.equal(widget.components[0].component, 'FlightCard');
    assert.equal(widget.dataStates[0].data.flight, 'AA123');
  });

  it('automatically synthesizes default, stress, empty, and alert scenarios', () => {
    const mockStory: StorybookStoryData = {
      id: 'flight-card--default',
      name: 'Default',
      title: 'Components/FlightCard',
      argTypes: {
        flightNumber: {control: 'text'},
        gate: {control: 'text'},
        passengers: {control: 'number'},
        status: {
          control: 'select',
          options: ['On Time', 'Boarding', 'Delayed', 'Cancelled'],
        },
      },
      args: {
        flightNumber: 'AA 124',
        gate: 'B14',
        passengers: 180,
        status: 'On Time',
      },
    };

    const scenarios = generateScenariosForStory(mockStory);

    assert.ok(scenarios.length >= 3);

    // 1. Default scenario
    const defaultScenario = scenarios.find(s => s.id === 'default');
    assert.ok(defaultScenario);
    assert.equal(defaultScenario.args.flightNumber, 'AA 124');
    assert.equal(defaultScenario.widget.components[0].component, 'FlightCard');
    const dm0 = defaultScenario.messages[0];
    if ('createSurface' in dm0) {
      assert.equal(dm0.createSurface.surfaceId, 'storybook-surface');
    } else {
      assert.fail('Expected createSurface message');
    }

    // 2. Stress scenario
    const stressScenario = scenarios.find(s => s.id === 'stress-content');
    assert.ok(stressScenario);
    assert.ok(String(stressScenario.args.flightNumber).length > 20);

    // 3. Empty scenario
    const emptyScenario = scenarios.find(s => s.id === 'minimal-empty');
    assert.ok(emptyScenario);
    assert.equal(emptyScenario.args.flightNumber, '');
    assert.equal(emptyScenario.args.passengers, 0);

    // 4. Alert scenario (detected 'Delayed' / 'Cancelled' options)
    const alertScenario = scenarios.find(s => s.id === 'alert-state');
    assert.ok(alertScenario);
    assert.ok(/delayed|cancelled/i.test(String(alertScenario.args.status)));
  });

  it('respects user-provided custom scenarios from story parameters', () => {
    const mockStory: StorybookStoryData = {
      id: 'custom-story',
      name: 'Custom',
      title: 'Components/Custom',
      parameters: {
        a2ui: {
          scenarios: [
            {
              id: 'custom-1',
              name: 'My Special Case',
              description: 'Handcrafted test',
              category: 'custom',
              args: {foo: 'bar'},
              widget: buildA2UIWidget('Custom', {foo: 'bar'}),
              messages: [],
            },
          ],
        },
      },
    };

    const scenarios = generateScenariosForStory(mockStory);
    assert.equal(scenarios.length, 1);
    assert.equal(scenarios[0].id, 'custom-1');
  });
});
