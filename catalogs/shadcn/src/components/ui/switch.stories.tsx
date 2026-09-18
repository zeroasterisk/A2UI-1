import type {Meta, StoryObj} from '@storybook/react';
import {Switch} from './switch';
import {Label} from './label';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: args => (
    <div className="flex items-center space-x-2">
      <Switch {...args} id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const Checked: Story = {args: {defaultChecked: true}};
export const Disabled: Story = {args: {disabled: true}};
