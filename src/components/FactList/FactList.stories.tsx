import type { Meta, StoryObj } from '@storybook/react-vite';
import { LevelMeter } from '../LevelMeter';
import { Fact, FactList } from './FactList';

const icon = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
} as const;

function CalendarIcon() {
  return (
    <svg {...icon}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg {...icon}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg {...icon}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

const meta = {
  title: 'Components/FactList',
  component: FactList,
  args: { size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => (
    <FactList {...args}>
      <Fact icon={<LevelMeter value={1} />} label="Level">
        Beginner · HSK 1–3
      </Fact>
      <Fact icon={<CalendarIcon />} label="Published">
        <time dateTime="2026-11-27">November 27, 2026</time>
      </Fact>
      <Fact icon={<ClockIcon />} label="Reading time">
        19 minutes
      </Fact>
    </FactList>
  ),
} satisfies Meta<typeof FactList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <FactList key={size} size={size}>
          <Fact icon={<LevelMeter value={2} />} label="Level">
            Intermediate
          </Fact>
          <Fact icon={<CalendarIcon />} label="Published">
            November 27, 2026
          </Fact>
          <Fact icon={<ClockIcon />} label="Reading time">
            19 minutes
          </Fact>
        </FactList>
      ))}
    </div>
  ),
};

export const Course: Story = {
  render: () => (
    <FactList>
      <Fact icon={<UserIcon />} label="Teacher">
        Anna Lee
      </Fact>
      <Fact icon={<ClockIcon />} label="Duration">
        12 lessons · 6 weeks
      </Fact>
      <Fact icon={<LevelMeter value={3} />} label="Difficulty">
        Advanced
      </Fact>
    </FactList>
  ),
};

export const WithoutIcons: Story = {
  render: () => (
    <FactList size="sm">
      <Fact label="Words">1 000</Fact>
      <Fact label="Groups">37</Fact>
      <Fact label="Examples">111</Fact>
    </FactList>
  ),
};
