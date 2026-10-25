import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

const meta = {
  title: 'Components/Radio',
  component: RadioGroup,
  args: { label: 'Delivery', defaultValue: 'courier' },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="courier" label="Courier" description="Tomorrow, 10:00–14:00" />
      <Radio value="pickup" label="Pickup point" description="Today after 18:00" />
      <Radio value="post" label="Post" description="5–7 days" disabled />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup label="Units" orientation="horizontal" defaultValue="km">
      <Radio value="km" label="Kilometres" />
      <Radio value="mi" label="Miles" />
    </RadioGroup>
  ),
};

function ControlledDemo() {
  const [plan, setPlan] = useState('month');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <RadioGroup label="Plan" value={plan} onValueChange={setPlan} size="sm">
        <Radio value="month" label="Monthly" />
        <Radio value="year" label="Yearly" description="Two months free" />
      </RadioGroup>
      <div style={{ color: 'var(--vui-color-text-muted)', fontSize: 14 }}>Selected: {plan}</div>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
