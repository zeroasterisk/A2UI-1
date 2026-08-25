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

import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import {
  StorybookPreviewBridge,
  normalizeA2UIPropsToStorybookArgs,
  inferStoryId,
} from './storybook-preview-bridge';
import type {A2UIComponent} from '@/types/widget';

describe('StorybookPreviewBridge', () => {
  describe('normalizeA2UIPropsToStorybookArgs', () => {
    it('normalizes v0.9 component props with flat values', () => {
      const component: A2UIComponent = {
        id: 'btn-1',
        component: 'Button',
        label: 'Submit',
        variant: 'primary',
        disabled: false,
      };

      const args = normalizeA2UIPropsToStorybookArgs(component);

      expect(args).toEqual({
        label: 'Submit',
        variant: 'primary',
        disabled: false,
      });
    });

    it('resolves $bind input placeholders against data state', () => {
      const component: A2UIComponent = {
        id: 'stat-1',
        component: 'MetricCard',
        title: {$bind: 'inputs.title'},
        value: {$bind: 'inputs.revenue'},
      };

      const data = {
        title: 'Monthly Recurring Revenue',
        revenue: '$140,000',
      };

      const args = normalizeA2UIPropsToStorybookArgs(component, data);

      expect(args).toEqual({
        title: 'Monthly Recurring Revenue',
        value: '$140,000',
      });
    });

    it('normalizes v0.8 nested component definitions', () => {
      const component: A2UIComponent = {
        id: 'btn-legacy',
        component: {
          Button: {
            text: {literalString: 'Click Me'},
            primary: true,
          },
        },
      };

      const args = normalizeA2UIPropsToStorybookArgs(component);

      expect(args).toEqual({
        text: 'Click Me',
        primary: true,
      });
    });
  });

  describe('inferStoryId', () => {
    it('infers story ID from v0.9 component string', () => {
      const component: A2UIComponent = {
        id: '1',
        component: 'Button',
      };
      expect(inferStoryId(component)).toBe('button--default');
    });

    it('infers story ID from v0.8 component object', () => {
      const component: A2UIComponent = {
        id: '1',
        component: {
          MetricCard: {},
        },
      };
      expect(inferStoryId(component)).toBe('metriccard--default');
    });

    it('falls back to default story when component is undefined', () => {
      expect(inferStoryId(undefined)).toBe('example-button--primary');
    });
  });

  describe('Component Rendering', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('renders the iframe with the correct URL scheme', () => {
      const components: A2UIComponent[] = [
        {
          id: 'root-card',
          component: 'Card',
          padding: 'medium',
        },
      ];

      render(
        <StorybookPreviewBridge
          root="root-card"
          components={components}
          data={{}}
          defaultStorybookUrl="http://localhost:6006"
        />,
      );

      const iframe = screen.getByTitle('Storybook Canvas Preview') as HTMLIFrameElement;
      expect(iframe).toBeDefined();
      expect(iframe.src).toContain('http://localhost:6006/iframe.html?id=card--default&viewMode=story');
    });

    it('renders the connection status indicator and storyId', () => {
      const components: A2UIComponent[] = [
        {
          id: 'flight-1',
          component: 'FlightStatus',
        },
      ];

      render(
        <StorybookPreviewBridge
          root="flight-1"
          components={components}
          data={{}}
          defaultStorybookUrl="http://localhost:6006"
        />,
      );

      expect(screen.getByText('Connecting to Storybook...')).toBeDefined();
      expect(screen.getByText('flightstatus--default')).toBeDefined();
    });
  });
});
