import type {Meta, StoryObj} from '@storybook/react';
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
  ItemSeparator,
} from './item';
import {Button} from './button';
import {Avatar, AvatarImage, AvatarFallback} from './avatar';

const meta: Meta<typeof Item> = {
  title: 'Components/Item',
  component: Item,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Item>;

export const Default: Story = {
  render: () => (
    <ItemGroup className="w-[350px] border rounded-md">
      <Item>
        <ItemMedia variant="image">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Alan Blount</ItemTitle>
          <ItemDescription>AI/ML Engineer at Google</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            View
          </Button>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>A2UI Protocol</ItemTitle>
          <ItemDescription>Agent-to-User Interface spec</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  ),
};
