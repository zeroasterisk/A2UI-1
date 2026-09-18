import type {Meta, StoryObj} from '@storybook/react';
import {Kbd} from './kbd';

const meta: Meta<typeof Kbd> = {
  title: 'Components/Kbd',
  component: Kbd,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Kbd>;

export const Default: Story = {args: {children: '⌘K'}};

export const Sequence: Story = {
  render: () => (
    <div className="flex items-center gap-1">
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>B</Kbd>
    </div>
  ),
};
