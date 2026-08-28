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
import type {A2UIMessage, A2UIWidget, StorybookManagerApi, StorybookStoryData} from '../types.js';
import {transformStoryToA2UISchema} from '../lib/a2ui-transformer.js';
import {buildA2UIWidget, buildV09Messages} from '../lib/scenario-engine.js';

interface AgentChatProps {
  currentStory: StorybookStoryData;
  api: StorybookManagerApi;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  widget?: A2UIWidget;
  messages?: A2UIMessage[];
  timestamp: string;
}

export const AgentChat: React.FC<AgentChatProps> = ({currentStory, api}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'I am your A2UI Composer agent. Prompt me to generate component variations, simulate agent state transitions, or update your active Storybook story.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const userPrompt = prompt.trim();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setIsGenerating(true);

    // Simulate Agent reasoning and prop update
    setTimeout(() => {
      const schema = transformStoryToA2UISchema(currentStory);
      const currentArgs = (currentStory.args || currentStory.initialArgs || {}) as Record<
        string,
        unknown
      >;
      const newArgs = {...currentArgs};

      // Heuristic intent matcher simulating LLM tool call 'editWidget'
      const lower = userPrompt.toLowerCase();
      for (const [key, propDef] of Object.entries(schema.properties)) {
        if (propDef.type === 'string') {
          if (lower.includes('title') && key.toLowerCase().includes('title')) {
            newArgs[key] = 'Updated via A2UI Composer';
          } else if (lower.includes('label') && key.toLowerCase().includes('label')) {
            newArgs[key] = 'Agent Action';
          } else if (lower.includes('cancel') || lower.includes('delete')) {
            if (key.toLowerCase().includes('text') || key.toLowerCase().includes('label')) {
              newArgs[key] = 'Delete Item';
            }
          }
        }
        if (propDef.type === 'enum' && propDef.options) {
          if (
            lower.includes('destructive') ||
            lower.includes('danger') ||
            lower.includes('error')
          ) {
            const dangerOpt = propDef.options.find(o => /danger|destructive|error/i.test(o));
            if (dangerOpt) newArgs[key] = dangerOpt;
          } else if (lower.includes('primary') || lower.includes('success')) {
            const primaryOpt = propDef.options.find(o => /primary|success/i.test(o));
            if (primaryOpt) newArgs[key] = primaryOpt;
          }
        }
        if (propDef.type === 'boolean') {
          if (lower.includes('disable')) newArgs[key] = true;
          if (lower.includes('enable')) newArgs[key] = false;
        }
      }

      // Generate A2UI Widget and Messages matching tools/composer
      const catalogId =
        currentStory.parameters?.a2ui?.catalogId ||
        'https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json';
      const generatedWidget = buildA2UIWidget(schema.name, newArgs, 'agent-generated');
      const generatedMessages = buildV09Messages(
        'storybook-surface',
        catalogId,
        'root',
        generatedWidget.components,
        newArgs,
      );

      // Hot-update Storybook canvas live
      api.updateStoryArgs(currentStory, newArgs);

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `Applied updates for: "${userPrompt}". Storybook canvas has been hot-reloaded with the new widget definition.`,
        widget: generatedWidget,
        messages: generatedMessages,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsGenerating(false);
    }, 400);
  };

  return (
    <div
      style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '16px',
          maxHeight: '320px',
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              backgroundColor: msg.sender === 'user' ? '#2563eb' : '#f1f5f9',
              color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              lineHeight: 1.4,
            }}
          >
            <div style={{fontWeight: 600, fontSize: '11px', marginBottom: '4px', opacity: 0.8}}>
              {msg.sender === 'user' ? 'You' : 'A2UI Composer Agent'} • {msg.timestamp}
            </div>
            <div>{msg.text}</div>
            {msg.widget && (
              <details style={{marginTop: '8px'}}>
                <summary
                  style={{
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#0369a1',
                  }}
                >
                  View Generated Composer Widget
                </summary>
                <pre
                  style={{
                    margin: '6px 0 0 0',
                    padding: '8px',
                    backgroundColor: '#0f172a',
                    color: '#f8fafc',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    overflowX: 'auto',
                  }}
                >
                  {JSON.stringify(msg.widget, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{display: 'flex', gap: '8px'}}>
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. 'Make button destructive and change label to Cancel Flight'..."
          disabled={isGenerating}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: '12px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          style={{
            padding: '8px 16px',
            backgroundColor: isGenerating ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 500,
            cursor: isGenerating ? 'not-allowed' : 'pointer',
          }}
        >
          {isGenerating ? 'Generating...' : 'Send Prompt'}
        </button>
      </form>
    </div>
  );
};
