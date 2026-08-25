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

import React, {useMemo, useState} from 'react';
import type {StorybookManagerApi, StorybookStoryData} from '../types.js';
import {generateScenariosForStory} from '../lib/scenario-engine.js';
import {ScenarioPicker} from './ScenarioPicker.js';
import {AgentChat} from './AgentChat.js';
import {CatalogInspector} from './CatalogInspector.js';

interface A2UIPanelProps {
  active?: boolean;
  api: StorybookManagerApi;
}

type TabKey = 'scenarios' | 'chat' | 'catalog' | 'settings';

export const A2UIPanel: React.FC<A2UIPanelProps> = ({active, api}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('scenarios');
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem('A2UI_GEMINI_API_KEY') || '';
    } catch {
      return '';
    }
  });

  const storyData: StorybookStoryData | null = api.getCurrentStoryData() || null;

  const scenarios = useMemo(() => {
    if (!storyData) return [];
    return generateScenariosForStory(storyData);
  }, [storyData]);

  if (!active) {
    return null;
  }

  if (!storyData) {
    return (
      <div style={{padding: '24px', color: '#6b7280', textAlign: 'center', fontSize: '13px'}}>
        Select a component story in the Storybook sidebar to interact with A2UI.
      </div>
    );
  }

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    try {
      localStorage.setItem('A2UI_GEMINI_API_KEY', key);
    } catch (e) {
      console.warn('Failed to save API key to localStorage', e);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '13px',
      }}
    >
      {/* Addon Subheader Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f8fafc',
          padding: '0 16px',
        }}
      >
        <div style={{display: 'flex', gap: '4px'}}>
          <button
            type="button"
            onClick={() => setActiveTab('scenarios')}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderBottom:
                activeTab === 'scenarios' ? '2px solid #2563eb' : '2px solid transparent',
              backgroundColor: 'transparent',
              fontWeight: activeTab === 'scenarios' ? 600 : 400,
              color: activeTab === 'scenarios' ? '#2563eb' : '#4b5563',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Scenarios & Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderBottom: activeTab === 'chat' ? '2px solid #2563eb' : '2px solid transparent',
              backgroundColor: 'transparent',
              fontWeight: activeTab === 'chat' ? 600 : 400,
              color: activeTab === 'chat' ? '#2563eb' : '#4b5563',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            A2UI Agent Chat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderBottom: activeTab === 'catalog' ? '2px solid #2563eb' : '2px solid transparent',
              backgroundColor: 'transparent',
              fontWeight: activeTab === 'catalog' ? 600 : 400,
              color: activeTab === 'catalog' ? '#2563eb' : '#4b5563',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Catalog Schema
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '10px 14px',
              border: 'none',
              borderBottom:
                activeTab === 'settings' ? '2px solid #2563eb' : '2px solid transparent',
              backgroundColor: 'transparent',
              fontWeight: activeTab === 'settings' ? 600 : 400,
              color: activeTab === 'settings' ? '#2563eb' : '#4b5563',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Settings
          </button>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'inline-block',
            }}
          />
          <span style={{fontSize: '11px', color: '#4b5563', fontWeight: 500}}>A2UI Connected</span>
        </div>
      </div>

      {/* Tab Content Areas */}
      <div style={{flex: 1, overflowY: 'auto'}}>
        {activeTab === 'scenarios' && (
          <ScenarioPicker
            scenarios={scenarios}
            currentStory={storyData}
            api={api}
            onSelectScenario={() => {}}
          />
        )}

        {activeTab === 'chat' && <AgentChat currentStory={storyData} api={api} />}

        {activeTab === 'catalog' && <CatalogInspector currentStory={storyData} />}

        {activeTab === 'settings' && (
          <div style={{padding: '20px', maxWidth: '540px'}}>
            <h4 style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600}}>
              A2UI Storybook Addon Configuration
            </h4>
            <p style={{margin: '0 0 16px 0', fontSize: '12px', color: '#6b7280'}}>
              Configure your AI agent provider and model parameters. Keys are stored locally in your
              browser.
            </p>

            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <div>
                <label
                  style={{display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px'}}
                >
                  Gemini API Key (Optional for live LLM streaming):
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => handleSaveApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label
                  style={{display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px'}}
                >
                  Active A2UI Protocol Version:
                </label>
                <select
                  defaultValue="v0.9.1"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="v0.9.1">v0.9.1 (Active Multi-Language Standard)</option>
                  <option value="v1.0">v1.0 (Candidate Specification)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
