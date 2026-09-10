import type {Meta, StoryObj} from '@storybook/react';
import {Progress} from './progress';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: {value: 40},
};
export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = {render: args => <Progress {...args} className="w-[60%]" />};
export const Empty: Story = {
  args: {value: 0},
  render: args => <Progress {...args} className="w-[60%]" />,
};
export const Complete: Story = {
  args: {value: 100},
  render: args => <Progress {...args} className="w-[60%]" />,
};
