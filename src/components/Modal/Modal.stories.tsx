import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { ImageInput } from '../ImageInput';
import { Input } from '../Input';
import { SegmentedControl } from '../SegmentedControl';
import { Textarea } from '../Textarea';
import { Modal } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  args: { open: false, onClose: () => {}, title: 'Delete lesson?' },
  argTypes: { actions: { control: false }, icon: { control: false } },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Modal
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          description="Students who already have it keep their answers."
          actions={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </>
          }
        />
      </>
    );
  },
};

function LessonForm() {
  const [folder, setFolder] = useState('none');
  return (
    <>
      <ImageInput block label="Cover" onFileSelect={() => {}} />
      <Input block label="Title" placeholder="Travelling in China" />
      <Textarea block label="Description" placeholder="What the lesson is about" rows={3} />
      <SegmentedControl
        block
        aria-label="Folder"
        value={folder}
        onValueChange={setFolder}
        options={[
          { value: 'none', label: 'No folder' },
          { value: 'hsk1', label: 'HSK 1' },
          { value: 'hsk2', label: 'HSK 2' },
          { value: 'hsk3', label: 'HSK 3' },
        ]}
      />
    </>
  );
}

/** Форма в окне: иконка сверху центрирует шапку, кнопки внизу — равной ширины. */
export const WithForm: Story = {
  render: function Render() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>New lesson</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          icon="📖"
          title="New lesson"
          description="Start with a title and a cover — add blocks on the next step."
          actions={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Create</Button>
            </>
          }
        >
          <LessonForm />
        </Modal>
      </>
    );
  },
};

export const Sizes: Story = {
  render: function Render() {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null);
    return (
      <div style={{ display: 'flex', gap: 12 }}>
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <Button key={s} variant="secondary" onClick={() => setSize(s)}>
            {s}
          </Button>
        ))}
        <Modal
          open={size !== null}
          onClose={() => setSize(null)}
          size={size ?? 'md'}
          title={`Size ${size}`}
          description="400, 520 or 720 px wide; on a phone — the screen width minus 16 px on each side."
          actions={<Button onClick={() => setSize(null)}>OK</Button>}
        />
      </div>
    );
  },
};
