import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Banner } from './Banner';

const meta = {
  title: 'Components/Banner',
  component: Banner,
  args: {
    tone: 'info',
    title: 'Backup is turned off',
    children: 'Photos are stored only on this phone',
  },
  argTypes: { action: { control: false }, icon: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 520 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Banner tone="info" title="New recipes every Friday">
        We will add them to your weekly list automatically
      </Banner>
      <Banner tone="success" title="Playlist saved">
        It is available offline now
      </Banner>
      <Banner tone="warning" title="Storage almost full">
        Free up space to keep backing up photos
      </Banner>
      <Banner tone="danger" title="Payment failed">
        Check the card details and try again
      </Banner>
      <Banner tone="neutral">Changes are saved automatically</Banner>
    </div>
  ),
};

function ActionsDemo() {
  const [visible, setVisible] = useState(true);
  if (!visible)
    return (
      <Button variant="secondary" size="sm" onClick={() => setVisible(true)}>
        Show the banner again
      </Button>
    );
  return (
    <Banner
      tone="warning"
      title="Storage almost full"
      onClose={() => setVisible(false)}
      action={
        <>
          <Button size="sm">Free up space</Button>
          <Button size="sm" variant="ghost">
            Later
          </Button>
        </>
      }
    >
      Free up space to keep backing up photos
    </Banner>
  );
}

export const WithActions: Story = {
  render: () => <ActionsDemo />,
};
