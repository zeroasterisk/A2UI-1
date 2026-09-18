import type {Meta, StoryObj} from '@storybook/react';
import {Collapsible, CollapsibleTrigger, CollapsibleContent} from './collapsible';
import {Button} from './button';
import {ChevronsUpDown} from 'lucide-react';

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-[350px] space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">@zeroasterisk starred 3 repositories</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">a2ui-project/a2ui</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm">shadcn-ui/ui</div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm">storybookjs/storybook</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
