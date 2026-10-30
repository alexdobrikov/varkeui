import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatCard } from './StatCard';
import { StatRow } from './StatRow';

const meta = {
  title: 'Components/StatCard',
  component: StatCard,
  args: {
    featured: true,
    label: 'Next lesson',
    tag: 'tomorrow',
    caption: 'Saturday',
    title: 'October 31',
    value: '14:00',
    color: '#a0195a',
  },
  argTypes: {
    label: { control: 'text' },
    tag: { control: 'text' },
    caption: { control: 'text' },
    title: { control: 'text' },
    value: { control: 'text' },
    color: { control: 'color' },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const berry = '#a0195a';

export const Playground: Story = {};

export const Lessons: Story = {
  render: () => (
    <StatRow>
      <StatCard
        featured
        color={berry}
        label="Next lesson"
        tag="tomorrow"
        caption="Saturday"
        title="October 31"
        value="14:00"
        onClick={() => {}}
      />
      <StatCard
        color={berry}
        tag="Saturday"
        caption="November 7"
        value="14:00"
        onClick={() => {}}
      />
      <StatCard
        color={berry}
        tag="Saturday"
        caption="November 14"
        value="14:00"
        onClick={() => {}}
      />
    </StatRow>
  ),
};

export const Weather: Story = {
  render: () => (
    <StatRow>
      <StatCard
        featured
        color="#3b6ff5"
        label="Now"
        tag="Lisbon"
        caption="Light rain"
        title="Feels like 14°"
        value="17°"
      />
      <StatCard color="#3b6ff5" tag="Sat" caption="Cloudy" value="19°" />
      <StatCard color="#3b6ff5" tag="Sun" caption="Sunny" value="22°" />
      <StatCard color="#3b6ff5" tag="Mon" caption="Showers" value="16°" />
    </StatRow>
  ),
};

export const Flight: Story = {
  render: () => (
    <StatRow>
      <StatCard
        featured
        color="#1f9d55"
        label="Departure"
        tag="on time"
        caption="Gate B12"
        title="Lisbon → Berlin"
        value="09:40"
      />
      <StatCard color="#1f9d55" label="Boarding" value="09:05" align="start" />
      <StatCard color="#1f9d55" label="Arrival" value="13:25" align="start" />
    </StatRow>
  ),
};

export const Activity: Story = {
  render: () => (
    <StatRow>
      <StatCard
        featured
        label="Steps"
        tag="today"
        caption="Goal 10 000"
        title="84% done"
        value="8 412"
      />
      <StatCard label="Calories" caption="kcal" value="512" align="start" />
      <StatCard label="Distance" caption="km" value="6.1" align="start" />
    </StatRow>
  ),
};

export const Finance: Story = {
  render: () => (
    <StatRow itemWidth={200}>
      <StatCard
        featured
        color="#c27c0e"
        label="Balance"
        tag="+4.2%"
        caption="October"
        title="Spent $1,280"
        value="$12,840"
      />
      <StatCard color="#c27c0e" tag="Income" caption="this month" value="$4,500" />
    </StatRow>
  ),
};

export const Tints: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <StatRow>
        <StatCard featured label="Without color" tag="surface" title="Neutral" value="42" />
        <StatCard tag="surface" caption="Neutral" value="7" />
      </StatRow>
      <StatRow>
        <StatCard featured color={berry} label="With color" tag="55%" title="Tinted" value="42" />
        <StatCard color={berry} tag="70%" caption="25%" value="7" />
      </StatRow>
    </div>
  ),
};

export const Layouts: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      {[2, 1, 0].map((count) => (
        <StatRow key={count}>
          <StatCard
            featured
            color={berry}
            label="Next lesson"
            tag="tomorrow"
            caption="Saturday"
            title="October 31"
            value="14:00"
          />
          {[7, 14].slice(0, count).map((day) => (
            <StatCard
              key={day}
              color={berry}
              tag="Saturday"
              caption={`November ${day}`}
              value="14:00"
            />
          ))}
        </StatRow>
      ))}
    </div>
  ),
};

export const Phone: Story = {
  render: () => (
    <div style={{ maxWidth: 380 }}>
      <StatRow>
        <StatCard
          featured
          color={berry}
          label="Next lesson"
          tag="tomorrow"
          caption="Saturday"
          title="October 31"
          value="14:00"
        />
        <StatCard color={berry} tag="Saturday" caption="November 7" value="14:00" />
        <StatCard color={berry} tag="Saturday" caption="November 14" value="14:00" />
      </StatRow>
    </div>
  ),
};
