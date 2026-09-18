import type {Meta, StoryObj} from '@storybook/react';
import {FieldSet, FieldLegend, FieldGroup, Field, FieldLabel, FieldDescription} from './field';
import {Input} from './input';

const meta: Meta<typeof Field> = {
  title: 'Components/Field',
  component: Field,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => (
    <FieldSet className="w-[350px]">
      <FieldLegend>Profile</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="field-name">Name</FieldLabel>
          <Input id="field-name" placeholder="Alan Blount" />
          <FieldDescription>Your full name as it appears publicly.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="field-email">Email</FieldLabel>
          <Input id="field-email" type="email" placeholder="you@example.com" />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
};
