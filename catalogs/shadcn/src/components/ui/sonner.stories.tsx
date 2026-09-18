import type {Meta, StoryObj} from '@storybook/react';
import {Toaster} from './sonner';
import {Button} from './button';
import {toast} from 'sonner';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Sonner',
  component: Toaster,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button variant="outline" onClick={() => toast('Event has been created')}>
        Show Toast
      </Button>
    </div>
  ),
};
