import type {Meta, StoryObj} from '@storybook/react';
import {Separator} from './separator';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: args => (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">A2UI</h4>
        <p className="text-sm text-muted-foreground">An open protocol for agent UI.</p>
      </div>
      <Separator {...args} className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};
