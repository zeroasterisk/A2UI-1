import type {Meta, StoryObj} from '@storybook/react';
import {Slider} from './slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: {defaultValue: [50], max: 100, step: 1},
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {render: args => <Slider {...args} className="w-[60%]" />};
export const Range: Story = {
  args: {defaultValue: [25, 75]},
  render: args => <Slider {...args} className="w-[60%]" />,
};
export const Disabled: Story = {
  args: {disabled: true},
  render: args => <Slider {...args} className="w-[60%]" />,
};
