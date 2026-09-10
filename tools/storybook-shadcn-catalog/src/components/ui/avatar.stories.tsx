import type {Meta, StoryObj} from '@storybook/react';
import {Avatar, AvatarImage, AvatarFallback} from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: args => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  render: args => (
    <Avatar {...args}>
      <AvatarImage src="https://broken-url.invalid/img.png" alt="broken" />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};
