'use client';
import React, { useEffect, useRef } from 'react';
import { renderMarkdown } from '@a2ui/markdown-it';

/**
 * Provides a markdown renderer to all a2ui-text elements inside it via
 * Lit context. Instead of using a Lit element with @provide (which requires
 * the accessor decorator unsupported by Turbopack), we dispatch a
 * context-request event response manually when child elements request it.
 */
export function A2UIMarkdownProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Listen for Lit context requests for the markdown renderer.
    // Lit context protocol: child dispatches 'context-request' with context key and callback.
    const handleContextRequest = (event: Event) => {
      const e = event as CustomEvent<{
        context: unknown;
        callback: (value: unknown, unsubscribe?: () => void) => void;
        subscribe?: boolean;
      }>;
      // The markdown context key is a Symbol stored inside @a2ui/lit.
      // We match on the context object type: it has a toString that includes 'A2UIMarkdown'.
      const contextKey = e.detail?.context;
      if (contextKey && String(contextKey) === 'Symbol(A2UIMarkdown)') {
        e.stopPropagation();
        e.detail.callback(renderMarkdown);
      }
    };

    container.addEventListener('context-request', handleContextRequest);
    return () => container.removeEventListener('context-request', handleContextRequest);
  }, []);

  return (
    <div ref={containerRef} style={{ display: 'contents' }}>
      {children}
    </div>
  );
}
