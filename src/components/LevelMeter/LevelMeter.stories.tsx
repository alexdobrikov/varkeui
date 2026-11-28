import type { Meta, StoryObj } from '@storybook/react-vite';
import { LevelMeter } from './LevelMeter';

const meta = {
  title: 'Components/LevelMeter',
  component: LevelMeter,
  args: { value: 1, max: 3 },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 5, step: 1 } },
    max: { control: { type: 'range', min: 1, max: 5, step: 1 } },
  },
  decorators: [(Story) => <div style={{ fontSize: 32 }}>{Story()}</div>],
} satisfies Meta<typeof LevelMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Levels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      {[0, 1, 2, 3].map((value) => (
        <LevelMeter key={value} value={value} label={`Level ${value} of 3`} />
      ))}
    </div>
  ),
};

export const InText: Story = {
  render: () => (
    <p
      style={{ fontSize: 16, color: 'var(--vui-color-text)', fontFamily: 'var(--vui-font-family)' }}
    >
      Difficulty <LevelMeter value={2} label="Intermediate" /> intermediate
    </p>
  ),
};
