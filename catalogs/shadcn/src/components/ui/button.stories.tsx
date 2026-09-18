import type {Meta, StoryObj} from '@storybook/react';
import {Mail, Loader2} from 'lucide-react';
import {Button} from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
  args: {
    children: 'Button',
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {args: {variant: 'default'}};
export const Destructive: Story = {args: {variant: 'destructive'}};
export const Outline: Story = {args: {variant: 'outline'}};
export const Secondary: Story = {args: {variant: 'secondary'}};
export const Ghost: Story = {args: {variant: 'ghost'}};
export const Link: Story = {args: {variant: 'link'}};

export const Small: Story = {args: {size: 'sm', children: 'Small'}};
export const Large: Story = {args: {size: 'lg', children: 'Large'}};

export const WithIcon: Story = {
  render: args => (
    <Button {...args}>
      <Mail /> Login with Email
    </Button>
  ),
};

export const IconOnly: Story = {
  args: {size: 'icon'},
  render: args => (
    <Button {...args}>
      <Mail />
    </Button>
  ),
};

export const Loading: Story = {
  render: args => (
    <Button {...args} disabled>
      <Loader2 className="animate-spin" /> Please wait
    </Button>
  ),
};

export const Disabled: Story = {args: {disabled: true}};
