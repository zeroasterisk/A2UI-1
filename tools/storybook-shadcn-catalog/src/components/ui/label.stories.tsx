import type {Meta, StoryObj} from '@storybook/react';
import {Label} from './label';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  args: {children: 'Your email address'},
};
export default meta;

type Story = StoryObj<typeof Label>;
export const Default: Story = {};
