import type {Meta, StoryObj} from '@storybook/react';
import {HoverCard, HoverCardTrigger, HoverCardContent} from './hover-card';
import {Button} from './button';
import {Avatar, AvatarImage, AvatarFallback} from './avatar';

const meta: Meta<typeof HoverCard> = {
  title: 'Components/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@zeroasterisk</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@zeroasterisk</h4>
            <p className="text-sm">AI/ML Engineer at Google. Works on A2UI protocol.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
