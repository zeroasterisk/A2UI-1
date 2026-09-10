import type {Meta, StoryObj} from '@storybook/react';
import {Checkbox} from './checkbox';
import {Label} from './label';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: args => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Checked: Story = {args: {defaultChecked: true}};
export const Disabled: Story = {args: {disabled: true}};
