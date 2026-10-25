import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '../Checkbox';
import { Radio, RadioGroup } from '../Radio';
import { SegmentedControl } from '../SegmentedControl';
import { Textarea } from '../Textarea';
import { CodeInput } from './CodeInput';

const meta = {
  title: 'Examples/Form',
  tags: ['!dev', '!autodocs'],
} satisfies Meta;

export default meta;

export const Readme: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 440 }}>
      <SegmentedControl
        aria-label="Route"
        block
        defaultValue="transit"
        options={[
          { value: 'walk', label: 'On foot' },
          { value: 'transit', label: 'Transit' },
          { value: 'bike', label: 'Bike' },
        ]}
      />
      <CodeInput aria-label="Verification code" defaultValue="4829" />
      <RadioGroup aria-label="Plan" orientation="horizontal" defaultValue="year">
        <Radio value="month" label="Monthly" />
        <Radio value="year" label="Yearly" />
      </RadioGroup>
      <Checkbox
        label="Send me the weekly digest"
        description="One email on Sunday morning"
        defaultChecked
      />
      <Textarea block label="Note" defaultValue="Water the plants on Thursday" minRows={2} />
    </div>
  ),
};
