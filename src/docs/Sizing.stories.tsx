import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlusIcon, SearchIcon } from '../icons';
import { Button, IconButton } from '../components/Button';
import { Chip } from '../components/Chip';
import { CodeInput } from '../components/CodeInput';
import { Input } from '../components/Input';
import { SegmentedControl } from '../components/SegmentedControl';

const meta = {
  title: 'Examples/Sizing',
  tags: ['!autodocs'],
} satisfies Meta;

export default meta;

const sizes = ['sm', 'md', 'lg'] as const;
const row = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' } as const;

export const ControlsInARow: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sizes.map((size) => (
        <div key={size} style={row}>
          <Input size={size} placeholder={`Input ${size}`} startIcon={<SearchIcon />} />
          <Button size={size} startIcon={<PlusIcon />}>
            Button
          </Button>
          <IconButton size={size} aria-label="Add" icon={<PlusIcon />} />
          <SegmentedControl
            size={size}
            aria-label="Period"
            options={[
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
            ]}
          />
        </div>
      ))}
      <div style={row}>
        <CodeInput aria-label="Code" length={4} defaultValue="12" />
        <Input placeholder="Input md" />
        <Chip>Chip md</Chip>
        <Chip size="sm">Chip sm</Chip>
      </div>
    </div>
  ),
};
