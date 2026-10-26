import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Scroller } from '../Scroller';
import { Chip } from './Chip';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  args: { children: 'Vegetarian', size: 'md' },
  argTypes: { icon: { control: false } },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' } as const;

export const Playground: Story = {};

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Drinks', 'Snacks', 'Soups'];

function SingleChoiceDemo() {
  const [active, setActive] = useState('All');
  return (
    <Scroller aria-label="Categories" gap={8} fade>
      {categories.map((category) => (
        <Chip
          key={category}
          selected={active === category}
          onSelectedChange={() => setActive(category)}
        >
          {category}
        </Chip>
      ))}
    </Scroller>
  );
}

export const SingleChoice: Story = {
  render: () => <SingleChoiceDemo />,
};

const filters = [
  { label: 'Quick', icon: '⚡️' },
  { label: 'Vegetarian', icon: '🥦' },
  { label: 'Spicy', icon: '🌶️' },
  { label: 'Kids', icon: '🧒' },
];

function MultiChoiceDemo() {
  const [selected, setSelected] = useState<string[]>(['Vegetarian']);
  return (
    <div style={row}>
      {filters.map(({ label, icon }) => (
        <Chip
          key={label}
          icon={<span style={{ fontSize: 16 }}>{icon}</span>}
          selected={selected.includes(label)}
          onSelectedChange={(on) =>
            setSelected((prev) => (on ? [...prev, label] : prev.filter((item) => item !== label)))
          }
        >
          {label}
        </Chip>
      ))}
    </div>
  );
}

export const MultipleChoice: Story = {
  render: () => <MultiChoiceDemo />,
};

function RemovableDemo() {
  const [tags, setTags] = useState(['Moscow', 'Saint Petersburg', 'Kazan', 'Sochi']);
  return (
    <div style={row}>
      {tags.map((tag) => (
        <Chip key={tag} onRemove={() => setTags((prev) => prev.filter((item) => item !== tag))}>
          {tag}
        </Chip>
      ))}
      {tags.length === 0 && (
        <Chip onClick={() => setTags(['Moscow', 'Saint Petersburg', 'Kazan', 'Sochi'])}>Reset</Chip>
      )}
    </div>
  );
}

export const Removable: Story = {
  render: () => <RemovableDemo />,
};

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Chip size="sm">Small</Chip>
      <Chip size="sm" selected>
        Small selected
      </Chip>
      <Chip>Medium</Chip>
      <Chip selected>Medium selected</Chip>
      <Chip disabled onClick={() => {}}>
        Disabled
      </Chip>
    </div>
  ),
};
