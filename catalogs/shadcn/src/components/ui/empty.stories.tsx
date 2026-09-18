import type {Meta, StoryObj} from '@storybook/react';
import {Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent} from './empty';
import {Button} from './button';
import {Inbox} from 'lucide-react';

const meta: Meta<typeof Empty> = {
  title: 'Components/Empty',
  component: Empty,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Empty>;

export const Default: Story = {
  render: () => (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>No messages yet</EmptyTitle>
        <EmptyDescription>You don't have any messages. Start a conversation.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Start conversation</Button>
      </EmptyContent>
    </Empty>
  ),
};
