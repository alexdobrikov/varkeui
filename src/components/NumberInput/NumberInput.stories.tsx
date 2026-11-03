import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { NumberInput } from './NumberInput';

const meta = {
  title: 'Components/NumberInput',
  component: NumberInput,
  args: { value: 2, onValueChange: () => {}, min: 2, max: 4, label: 'Participants' },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <NumberInput {...args} value={value} onValueChange={setValue} />;
  },
};

const column = { display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 320 } as const;

/** Шаг, формат и границы: часы с шагом 0,5, рубли с шагом 100. */
export const StepAndFormat: Story = {
  render: function Render() {
    const [hours, setHours] = useState(1.5);
    const [rate, setRate] = useState(1500);
    const rub = new Intl.NumberFormat('ru-RU');
    return (
      <div style={column}>
        <NumberInput
          label="Preparation per lesson"
          value={hours}
          onValueChange={setHours}
          min={0.5}
          max={5}
          step={0.5}
          format={(v) => `${String(v).replace('.', ',')} h`}
          block
        />
        <NumberInput
          label="Hourly rate"
          value={rate}
          onValueChange={setRate}
          min={0}
          max={10000}
          step={100}
          format={(v) => `${rub.format(v)} ₽`}
          block
        />
      </div>
    );
  },
};

export const Sizes: Story = {
  render: function Render() {
    const [value, setValue] = useState(3);
    return (
      <div style={column}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <NumberInput
            key={size}
            size={size}
            label={size}
            value={value}
            onValueChange={setValue}
            min={1}
            max={10}
          />
        ))}
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div style={column}>
      <NumberInput
        label="With hint"
        hint="From 2 to 4"
        value={2}
        onValueChange={() => {}}
        min={2}
        max={4}
      />
      <NumberInput
        label="With error"
        error="No more than 4"
        value={4}
        onValueChange={() => {}}
        min={2}
        max={4}
      />
      <NumberInput label="Disabled" disabled value={2} onValueChange={() => {}} />
    </div>
  ),
};
