import type {Meta, StoryObj} from '@storybook/react';
import {ButtonGroup, ButtonGroupText, ButtonGroupSeparator} from './button-group';
import {Button} from './button';
import {Bold, Italic, Underline} from 'lucide-react';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <Bold />
      </Button>
      <Button variant="outline" size="icon">
        <Italic />
      </Button>
      <Button variant="outline" size="icon">
        <Underline />
      </Button>
    </ButtonGroup>
  ),
};

export const WithText: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Prev</Button>
      <ButtonGroupText>Page 1 of 10</ButtonGroupText>
      <Button variant="outline">Next</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Top</Button>
      <ButtonGroupSeparator orientation="horizontal" />
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  ),
};
