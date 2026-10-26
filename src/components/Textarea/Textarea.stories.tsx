import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  args: { label: 'Note', placeholder: 'What do you want to remember?' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 480 } as const;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={column}>
      <Textarea
        block
        label="Feedback"
        placeholder="Tell us what to improve"
        hint="Grows with the text up to 8 lines"
        maxRows={8}
      />
      <Textarea
        block
        label="Bio"
        variant="outlined"
        maxLength={160}
        showCount
        defaultValue="Plant person, weekend hiker, amateur cook"
      />
      <Textarea block label="Comment" error="Write at least 10 characters" defaultValue="Nice" />
      <Textarea block label="Disabled" disabled defaultValue="Read only for now" minRows={2} />
      <Textarea block label="Manual resize" autoResize={false} hint="Drag the corner" />
    </div>
  ),
};
