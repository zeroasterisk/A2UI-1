import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {Calendar} from './calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Calendar>;

export const Single: Story = {
  render: () => {
    const CalendarWrapper = () => {
      const [date, setDate] = useState<Date | undefined>(new Date());
      return (
        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
      );
    };
    return <CalendarWrapper />;
  },
};

export const Range: Story = {
  render: () => {
    const CalendarWrapper = () => {
      const [range, setRange] = useState<{from: Date; to?: Date} | undefined>();
      return (
        <Calendar mode="range" selected={range} onSelect={setRange} className="rounded-md border" />
      );
    };
    return <CalendarWrapper />;
  },
};
