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

'use client';

import {useState, useEffect, useRef, useCallback} from 'react';
import {ExternalLink, RefreshCw, AlertCircle, CheckCircle2, Settings2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import type {A2UIComponent, SpecVersion} from '@/types/widget';

export interface StorybookPreviewBridgeProps {
  root: string;
  components: A2UIComponent[];
  data: Record<string, unknown>;
  specVersion?: SpecVersion;
  isDark?: boolean;
  defaultStorybookUrl?: string;
  onAction?: (action: unknown) => void;
}

/**
 * Normalizes A2UI component props and data bindings into a flat Storybook `args` object.
 */
export function normalizeA2UIPropsToStorybookArgs(
  component: A2UIComponent | undefined,
  data: Record<string, unknown> = {},
): Record<string, unknown> {
  if (!component) return {};

  const args: Record<string, unknown> = {};

  // Handle v0.8 structure (component: { Button: { ... } })
  if (typeof component.component === 'object' && component.component !== null) {
    const compObj = component.component as Record<string, Record<string, unknown>>;
    const compType = Object.keys(compObj)[0];
    const props = compType ? compObj[compType] : {};

    if (props && typeof props === 'object') {
      for (const [key, val] of Object.entries(props)) {
        if (val && typeof val === 'object') {
          // Resolve text value or path bindings
          const textObj = val as {literalString?: string; value?: string; path?: string};
          if (textObj.literalString !== undefined) {
            args[key] = textObj.literalString;
          } else if (textObj.value !== undefined) {
            args[key] = textObj.value;
          } else if (textObj.path && textObj.path in data) {
            args[key] = data[textObj.path];
          } else {
            args[key] = val;
          }
        } else {
          args[key] = val;
        }
      }
    }
    return args;
  }

  // Handle v0.9 structure ({ id: "...", component: "Button", label: "Click", ... })
  for (const [key, val] of Object.entries(component)) {
    if (key === 'id' || key === 'component') continue;

    if (val && typeof val === 'object') {
      const bindingObj = val as {$bind?: string; literalString?: string; value?: string; path?: string};
      if (bindingObj.$bind && bindingObj.$bind.startsWith('inputs.')) {
        const propName = bindingObj.$bind.replace('inputs.', '');
        args[key] = data[propName] ?? propName;
      } else if (bindingObj.literalString !== undefined) {
        args[key] = bindingObj.literalString;
      } else if (bindingObj.value !== undefined) {
        args[key] = bindingObj.value;
      } else {
        args[key] = val;
      }
    } else {
      args[key] = val;
    }
  }

  return args;
}

/**
 * Infers a default Storybook story ID from an A2UI component.
 */
export function inferStoryId(component: A2UIComponent | undefined): string {
  if (!component) return 'example-button--primary';

  let typeName = '';
  if (typeof component.component === 'string') {
    typeName = component.component;
  } else if (typeof component.component === 'object' && component.component !== null) {
    typeName = Object.keys(component.component)[0] || '';
  }

  if (!typeName) return 'example-button--primary';

  const normalized = typeName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${normalized}--default`;
}

export function StorybookPreviewBridge({
  root,
  components,
  data,
  isDark = false,
  defaultStorybookUrl = 'http://localhost:6006',
  onAction,
}: StorybookPreviewBridgeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [storybookUrl, setStorybookUrl] = useState(defaultStorybookUrl);
  const [storyId, setStoryId] = useState(() => inferStoryId(components.find(c => c.id === root) || components[0]));
  const [isConnected, setIsConnected] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const activeComponent = components.find(c => c.id === root) || components[0];

  // Keep storyId updated if root component changes
  useEffect(() => {
    const inferred = inferStoryId(activeComponent);
    setStoryId(inferred);
  }, [activeComponent]);

  // Construct iframe target URL
  const iframeSrc = `${storybookUrl.replace(/\/$/, '')}/iframe.html?id=${encodeURIComponent(
    storyId,
  )}&viewMode=story${isDark ? '&globals=theme:dark' : ''}`;

  // PostMessage Channel API helper
  const sendStorybookUpdate = useCallback(
    (args: Record<string, unknown>) => {
      if (!iframeRef.current?.contentWindow) return;

      try {
        iframeRef.current.contentWindow.postMessage(
          {
            key: 'storybook-channel',
            event: {
              type: 'updateStoryArgs',
              args: [
                {
                  storyId,
                  updatedArgs: args,
                },
              ],
            },
          },
          '*',
        );
      } catch (err) {
        console.warn('Failed to dispatch postMessage to Storybook iframe:', err);
      }
    },
    [storyId],
  );

  // Sync props whenever components or data change
  useEffect(() => {
    if (!isConnected) return;
    const args = normalizeA2UIPropsToStorybookArgs(activeComponent, data);
    sendStorybookUpdate(args);
  }, [activeComponent, data, isConnected, sendStorybookUpdate]);

  // Listen for Storybook Channel events
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data;
      if (!data || data.key !== 'storybook-channel') return;

      const {type, args: eventArgs} = data.event || {};
      if (type === 'storyRendered' || type === 'currentStoryWasSet') {
        setIsConnected(true);
        setHasTimedOut(false);
        // Push current props immediately after render handshake
        const initialArgs = normalizeA2UIPropsToStorybookArgs(activeComponent, data);
        sendStorybookUpdate(initialArgs);
      } else if (type === 'storyAction') {
        onAction?.(eventArgs);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeComponent, data, onAction, sendStorybookUpdate]);

  // Set a timeout to detect when Storybook server is offline
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isConnected) {
        setHasTimedOut(true);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [isConnected, iframeSrc]);

  return (
    <div className="relative flex flex-col h-full w-full">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/40 text-xs">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Storybook Connected
            </span>
          ) : hasTimedOut ? (
            <span className="flex items-center gap-1 text-amber-600 font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              Storybook Offline
            </span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Connecting to Storybook...
            </span>
          )}
          <span className="text-muted-foreground/60">•</span>
          <span className="font-mono text-[11px] text-muted-foreground">{storyId}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px] gap-1"
            onClick={() => setShowConfig(!showConfig)}
          >
            <Settings2 className="h-3 w-3" />
            Config
          </Button>
          <a
            href={`${storybookUrl}/?path=/story/${encodeURIComponent(storyId)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3 w-3" />
            Open Standalone
          </a>
        </div>
      </div>

      {/* Optional Configuration Drawer */}
      {showConfig && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-muted/70 border-b border-border text-xs">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">URL:</span>
            <input
              type="text"
              value={storybookUrl}
              onChange={e => {
                setStorybookUrl(e.target.value);
                setIsConnected(false);
                setHasTimedOut(false);
              }}
              className="px-2 py-0.5 rounded border border-border bg-background font-mono text-[11px] w-48"
              placeholder="http://localhost:6006"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Story ID:</span>
            <input
              type="text"
              value={storyId}
              onChange={e => setStoryId(e.target.value)}
              className="px-2 py-0.5 rounded border border-border bg-background font-mono text-[11px] w-48"
              placeholder="button--primary"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-[11px]"
            onClick={() => {
              setIsConnected(false);
              setHasTimedOut(false);
              if (iframeRef.current) {
                iframeRef.current.src = iframeSrc;
              }
            }}
          >
            Reload
          </Button>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="relative flex-1 w-full h-full min-h-[300px] overflow-hidden bg-background">
        {hasTimedOut && !isConnected && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-background/95 backdrop-blur-sm text-center">
            <AlertCircle className="h-10 w-10 text-amber-500 mb-3" />
            <h4 className="text-sm font-semibold mb-1">Storybook Canvas Unreachable</h4>
            <p className="text-xs text-muted-foreground max-w-sm mb-4">
              Could not connect to Storybook at <code className="font-mono bg-muted px-1 rounded">{storybookUrl}</code>.
              Make sure your Storybook dev server is running.
            </p>
            <div className="bg-muted p-2.5 rounded font-mono text-xs text-left mb-4 text-muted-foreground">
              $ yarn storybook -p 6006
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setHasTimedOut(false);
                  if (iframeRef.current) iframeRef.current.src = iframeSrc;
                }}
              >
                Retry Connection
              </Button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          key={iframeSrc}
          src={iframeSrc}
          title="Storybook Canvas Preview"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={() => {
            // Iframe loaded, wait for channel event or fire update
            const args = normalizeA2UIPropsToStorybookArgs(activeComponent, data);
            sendStorybookUpdate(args);
          }}
        />
      </div>
    </div>
  );
}
