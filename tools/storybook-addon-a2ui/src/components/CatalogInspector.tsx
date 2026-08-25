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
import type {StorybookStoryData} from '../types.js';
import {generateAgentPromptSnippet, transformStoryToA2UISchema} from '../lib/a2ui-transformer.js';

interface CatalogInspectorProps {
  currentStory: StorybookStoryData;
}

export const CatalogInspector: React.FC<CatalogInspectorProps> = ({currentStory}) => {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const schema = transformStoryToA2UISchema(currentStory);
  const currentArgs = (currentStory.args || currentStory.initialArgs || {}) as Record<
    string,
    unknown
  >;
  const promptSnippet = generateAgentPromptSnippet(schema, currentArgs);
  const schemaJson = JSON.stringify(schema, null, 2);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopyStatus(`Copied ${label}!`);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div style={{padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h4 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: 600}}>
            A2UI Component Catalog Schema
          </h4>
          <p style={{margin: 0, fontSize: '12px', color: '#6b7280'}}>
            Derived automatically from Storybook argTypes for component: <code>{schema.name}</code>
          </p>
        </div>
        {copyStatus && (
          <span style={{fontSize: '12px', color: '#16a34a', fontWeight: 500}}>✓ {copyStatus}</span>
        )}
      </div>

      <div style={{display: 'flex', gap: '8px'}}>
        <button
          type="button"
          onClick={() => copyToClipboard(schemaJson, 'A2UI Schema')}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Copy Catalog Schema JSON
        </button>
        <button
          type="button"
          onClick={() => copyToClipboard(promptSnippet, 'Agent Prompt Snippet')}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Copy Agent Multi-Shot Example
        </button>
      </div>

      <div>
        <h5 style={{margin: '0 0 6px 0', fontSize: '12px', fontWeight: 600, color: '#374151'}}>
          Catalog Definition:
        </h5>
        <pre
          style={{
            margin: 0,
            padding: '12px',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            borderRadius: '6px',
            fontSize: '11px',
            fontFamily: 'monospace',
            maxHeight: '180px',
            overflow: 'auto',
          }}
        >
          {schemaJson}
        </pre>
      </div>

      <div>
        <h5 style={{margin: '0 0 6px 0', fontSize: '12px', fontWeight: 600, color: '#374151'}}>
          Agent System Prompt Injection:
        </h5>
        <pre
          style={{
            margin: 0,
            padding: '12px',
            backgroundColor: '#f1f5f9',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '11px',
            fontFamily: 'monospace',
            maxHeight: '180px',
            overflow: 'auto',
          }}
        >
          {promptSnippet}
        </pre>
      </div>
    </div>
  );
};
