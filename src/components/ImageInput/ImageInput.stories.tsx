import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ImageInput } from './ImageInput';

const meta = {
  title: 'Components/ImageInput',
  component: ImageInput,
  args: { label: 'Cover', onFileSelect: () => {} },
} satisfies Meta<typeof ImageInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Выбранный файл показывается превью сразу, без загрузки на сервер. */
export const WithPreview: Story = {
  render: function Render() {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    return (
      <div style={{ maxWidth: 480 }}>
        <ImageInput
          block
          label="Cover"
          hint="Drop a picture here or press Upload"
          value={url}
          loading={loading}
          onFileSelect={(file) => {
            setLoading(true);
            setTimeout(() => {
              setUrl(URL.createObjectURL(file));
              setLoading(false);
            }, 600);
          }}
          onRemove={() => setUrl(null)}
        />
      </div>
    );
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 480 }}>
      <ImageInput block label="Empty" onFileSelect={() => {}} />
      <ImageInput block label="Loading" loading onFileSelect={() => {}} />
      <ImageInput
        block
        label="Error"
        error="The file is larger than 25 MB"
        onFileSelect={() => {}}
      />
      <ImageInput block label="Disabled" disabled onFileSelect={() => {}} />
    </div>
  ),
};

/** File upload, paste, size validation and optional local WebP conversion. */
export const AllSources: Story = {
  render: function Render() {
    const [url, setUrl] = useState<string | null>(null);
    return (
      <ImageInput
        block
        label="Lesson cover"
        value={url}
        maxSize={5 * 1024 * 1024}
        webp
        allowPaste
        placeholder="JPG, PNG, WebP · up to 5 MB"
        hint="Files are converted to WebP before upload."
        onFileSelect={(file) => setUrl(URL.createObjectURL(file))}
        onRemove={() => setUrl(null)}
      />
    );
  },
};
