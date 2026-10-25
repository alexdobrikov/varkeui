import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { toast } from './store';
import { Toaster } from './Toaster';

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  args: { position: 'bottom-center', max: 3 },
  parameters: { docs: { story: { inline: false, iframeHeight: 360 } } },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 8, flexWrap: 'wrap' } as const;

export const Playground: Story = {
  render: (args) => (
    <>
      <div style={row}>
        <Button onClick={() => toast('Saved to favourites')}>Neutral</Button>
        <Button variant="secondary" onClick={() => toast.success('Playlist downloaded')}>
          Success
        </Button>
        <Button variant="secondary" onClick={() => toast.error('No connection')}>
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast('Note deleted', {
              action: { label: 'Undo', onClick: () => toast.success('Note restored') },
            })
          }
        >
          With undo
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.success('Backup finished', {
              description: '128 photos, 1.2 GB',
              duration: Infinity,
            })
          }
        >
          Until closed
        </Button>
        <Button variant="ghost" onClick={() => toast.dismiss()}>
          Dismiss all
        </Button>
      </div>
      <Toaster {...args} />
    </>
  ),
};

export const TopRight: Story = {
  args: { position: 'top-right' },
  render: Playground.render,
};
