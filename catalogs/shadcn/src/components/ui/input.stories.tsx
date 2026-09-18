import type {Meta, StoryObj} from '@storybook/react';
import {Input} from './input';
import {Label} from './label';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {control: 'select', options: ['text', 'email', 'password', 'number', 'file']},
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {args: {type: 'text', placeholder: 'Email'}};
export const Disabled: Story = {args: {type: 'text', placeholder: 'Email', disabled: true}};
export const File: Story = {args: {type: 'file'}};

export const WithLabel: Story = {
  render: args => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input {...args} type="email" id="email" placeholder="Email" />
    </div>
  ),
};
