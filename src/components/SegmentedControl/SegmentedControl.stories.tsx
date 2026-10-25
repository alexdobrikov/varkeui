import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';

const periods = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  args: { options: periods, 'aria-label': 'Period', size: 'md' },
  argTypes: { options: { control: false } },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 420 } as const;

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="7" height="7" rx="2" />
      <rect x="13" y="4" width="7" height="7" rx="2" />
      <rect x="4" y="13" width="7" height="7" rx="2" />
      <rect x="13" y="13" width="7" height="7" rx="2" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M5 7h14M5 12h14M5 17h14" />
    </svg>
  );
}

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={column}>
      <SegmentedControl aria-label="Small" size="sm" options={periods} />
      <SegmentedControl aria-label="Medium" options={periods} defaultValue="month" />
      <SegmentedControl aria-label="Large" size="lg" options={periods} defaultValue="year" />
    </div>
  ),
};

export const Block: Story = {
  render: () => (
    <div style={column}>
      <SegmentedControl
        aria-label="Route"
        block
        options={[
          { value: 'walk', label: 'On foot' },
          { value: 'transit', label: 'Transit' },
          { value: 'bike', label: 'Bike' },
          { value: 'car', label: 'Car', disabled: true },
        ]}
      />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={column}>
      <SegmentedControl
        aria-label="View"
        options={[
          { value: 'grid', icon: <GridIcon />, label: 'Grid' },
          { value: 'list', icon: <ListIcon />, label: 'List' },
        ]}
      />
      <SegmentedControl
        aria-label="View"
        size="sm"
        options={[
          { value: 'grid', icon: <GridIcon />, 'aria-label': 'Grid' },
          { value: 'list', icon: <ListIcon />, 'aria-label': 'List' },
        ]}
      />
    </div>
  ),
};

function ControlledDemo() {
  const [period, setPeriod] = useState('month');
  return (
    <div style={column}>
      <SegmentedControl
        aria-label="Period"
        options={periods}
        value={period}
        onValueChange={setPeriod}
      />
      <div style={{ color: 'var(--vui-color-text-muted)', fontSize: 14 }}>Showing: {period}</div>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
