import type {Meta, StoryObj} from '@storybook/react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from './sidebar';
import {Home, Inbox, Search, Settings} from 'lucide-react';

const items = [
  {title: 'Home', icon: Home},
  {title: 'Inbox', icon: Inbox},
  {title: 'Search', icon: Search},
  {title: 'Settings', icon: Settings},
];

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {layout: 'fullscreen'},
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>A2UI Catalog</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>v1.0.0</SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4">
          <SidebarTrigger />
          <p className="mt-4">Main content area.</p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};
