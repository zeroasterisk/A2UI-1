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

import React, {useState} from 'react';
import type {A2UIScenario, StorybookManagerApi, StorybookStoryData} from '../types.js';

interface ScenarioPickerProps {
  scenarios: A2UIScenario[];
  currentStory: StorybookStoryData;
  api: StorybookManagerApi;
  onSelectScenario: (scenario: A2UIScenario) => void;
}

export const ScenarioPicker: React.FC<ScenarioPickerProps> = ({
  scenarios,
  currentStory,
  api,
  onSelectScenario,
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('default');
  const [inspectedPayload, setInspectedPayload] = useState<string | null>(null);

  const handleApply = (scenario: A2UIScenario) => {
    setActiveScenarioId(scenario.id);
    onSelectScenario(scenario);
    api.updateStoryArgs(currentStory, scenario.args);
  };

  return (
    <div style={{padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h4 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600}}>
            Generative UI Scenario Simulator
          </h4>
          <p style={{margin: 0, fontSize: '12px', color: '#6b7280'}}>
            Drive the active Storybook component with simulated agent payloads and edge-case states.
          </p>
        </div>
        <span
          style={{
            fontSize: '11px',
            backgroundColor: '#e0f2fe',
            color: '#0369a1',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontWeight: 500,
          }}
        >
          {scenarios.length} Scenarios Available
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px',
        }}
      >
        {scenarios.map(scenario => {
          const isActive = activeScenarioId === scenario.id;
          return (
            <div
              key={scenario.id}
              style={{
                border: isActive ? '2px solid #2563eb' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: isActive ? '#f8fafc' : '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{fontWeight: 600, fontSize: '13px', color: '#1f2937'}}>
                    {scenario.name}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      backgroundColor:
                        scenario.category === 'warning'
                          ? '#fef2f2'
                          : scenario.category === 'stress'
                            ? '#fffbeb'
                            : '#f3f4f6',
                      color:
                        scenario.category === 'warning'
                          ? '#991b1b'
                          : scenario.category === 'stress'
                            ? '#92400e'
                            : '#374151',
                    }}
                  >
                    {scenario.category}
                  </span>
                </div>
                <p
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: '11px',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  {scenario.description}
                </p>
              </div>

              <div style={{display: 'flex', gap: '8px'}}>
                <button
                  type="button"
                  onClick={() => handleApply(scenario)}
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isActive ? '#2563eb' : '#f3f4f6',
                    color: isActive ? '#ffffff' : '#1f2937',
                    cursor: 'pointer',
                  }}
                >
                  {isActive ? 'Active State' : 'Apply State'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setInspectedPayload(
                      inspectedPayload === scenario.id
                        ? null
                        : JSON.stringify(scenario.a2uiPayload, null, 2),
                    )
                  }
                  style={{
                    padding: '6px 10px',
                    fontSize: '11px',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#ffffff',
                    color: '#4b5563',
                    cursor: 'pointer',
                  }}
                  title="Inspect A2UI JSON Payload"
                >
                  JSON
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {inspectedPayload && (
        <div style={{marginTop: '12px'}}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '6px',
            }}
          >
            <span style={{fontSize: '12px', fontWeight: 600, color: '#374151'}}>
              Generated A2UI Payload (`surfaceUpdate`):
            </span>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(inspectedPayload)}
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
              }}
            >
              Copy JSON
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              padding: '12px',
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              borderRadius: '6px',
              fontSize: '11px',
              fontFamily: 'monospace',
              maxHeight: '200px',
              overflow: 'auto',
            }}
          >
            {inspectedPayload}
          </pre>
        </div>
      )}
    </div>
  );
};
