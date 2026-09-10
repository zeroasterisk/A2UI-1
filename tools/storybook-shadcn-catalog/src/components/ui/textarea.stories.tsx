import type {Meta, StoryObj} from '@storybook/react';
import {Textarea} from './textarea';
import {Label} from './label';
import {Button} from './button';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {args: {placeholder: 'Type your message here.'}};
export const Disabled: Story = {args: {placeholder: 'Type your message here.', disabled: true}};

export const WithLabel: Story = {
  render: args => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea {...args} id="message" placeholder="Type your message here." />
    </div>
  ),
};

export const WithButton: Story = {
  render: args => (
    <div className="grid w-full gap-2">
      <Textarea {...args} placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  ),
};
