import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { label: 'Send me the weekly digest', size: 'md' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 } as const;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={column}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Invalid" invalid />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled and checked" disabled defaultChecked />
      <Checkbox
        label="With a description"
        description="We send one email on Sunday morning, nothing else."
        defaultChecked
      />
      <Checkbox size="sm" label="Small" defaultChecked />
    </div>
  ),
};

const hobbies = ['Music', 'Cooking', 'Travel', 'Reading'];

function SelectAllDemo() {
  const [selected, setSelected] = useState<string[]>(['Music']);
  const all = selected.length === hobbies.length;
  return (
    <div style={column}>
      <Checkbox
        label="All interests"
        checked={all}
        indeterminate={selected.length > 0 && !all}
        onCheckedChange={(checked) => setSelected(checked ? hobbies : [])}
      />
      <div style={{ ...column, paddingLeft: 34, gap: 12 }}>
        {hobbies.map((hobby) => (
          <Checkbox
            key={hobby}
            label={hobby}
            checked={selected.includes(hobby)}
            onCheckedChange={(checked) =>
              setSelected((prev) => (checked ? [...prev, hobby] : prev.filter((h) => h !== hobby)))
            }
          />
        ))}
      </div>
    </div>
  );
}

export const SelectAll: Story = {
  render: () => <SelectAllDemo />,
};
