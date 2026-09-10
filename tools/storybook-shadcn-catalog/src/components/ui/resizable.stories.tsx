import type {Meta, StoryObj} from '@storybook/react';
import {ResizablePanelGroup, ResizablePanel, ResizableHandle} from './resizable';

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ResizablePanelGroup>;

export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-md rounded-lg border min-h-[200px]"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">One</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">Two</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
