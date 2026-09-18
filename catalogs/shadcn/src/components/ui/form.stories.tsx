import type {Meta, StoryObj} from '@storybook/react';
import {useForm} from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from './form';
import {Input} from './input';
import {Button} from './button';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Form>;

function FormDemo() {
  const form = useForm({defaultValues: {username: ''}});
  return (
    <Form {...form}>
      <form className="w-[350px] space-y-6" onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="zeroasterisk" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const Default: Story = {render: () => <FormDemo />};
