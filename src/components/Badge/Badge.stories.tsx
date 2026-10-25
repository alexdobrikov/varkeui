import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlusIcon } from '../../icons';
import { Button } from '../Button';
import { TileButton } from '../TileButton';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'New', tone: 'neutral', size: 'md' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' } as const;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={row}>
        <Badge>Neutral</Badge>
        <Badge tone="accent">Accent</Badge>
        <Badge tone="danger">Danger</Badge>
        <Badge tone="success">Success</Badge>
      </div>
      <div style={row}>
        <Badge size="sm">Neutral</Badge>
        <Badge size="sm" tone="accent">
          Accent
        </Badge>
        <Badge size="sm" tone="danger">
          Danger
        </Badge>
        <Badge size="sm" tone="success">
          Success
        </Badge>
      </div>
    </div>
  ),
};

export const Counters: Story = {
  render: () => (
    <div style={row}>
      <Badge tone="danger" count={3} />
      <Badge tone="danger" count={42} />
      <Badge tone="danger" count={240} />
      <Badge tone="accent" count={1000} max={999} />
      <Badge tone="danger" dot aria-label="Unread" />
      <Badge tone="success" dot size="sm" aria-label="Online" />
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div style={{ ...row, gap: 32, alignItems: 'flex-start' }}>
      <TileButton
        label="Inbox"
        image="demo/notebook.svg"
        imagePosition="bottom"
        badge={<Badge tone="danger" count={5} />}
      />
      <TileButton
        label="New list"
        image="demo/books.svg"
        imagePosition="bottom"
        variant="outlined"
        badge={<PlusIcon />}
      />
      <Button variant="secondary" endIcon={<Badge tone="danger" size="sm" count={12} />}>
        Messages
      </Button>
    </div>
  ),
};
