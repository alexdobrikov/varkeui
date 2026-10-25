import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { List, ListItem } from '../List';
import { Scroller } from '../Scroller';
import { TileButton } from '../TileButton';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: { variant: 'rect', width: 240, height: 120 },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 420 }}>
      <Skeleton width={160} height={160} radius={40} />
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Skeleton variant="circle" width={48} />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="80%" />
        </div>
      </div>
      <Skeleton variant="text" lines={4} />
    </div>
  ),
};

function ListSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '12px 0' }}
        >
          <Skeleton variant="circle" width={48} />
          <div style={{ flex: 1 }}>
            <Skeleton variant="text" width="40%" style={{ fontSize: 17 }} />
            <Skeleton variant="text" width="70%" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingDemo() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 560 }}
      aria-busy={!loaded}
    >
      <Scroller aria-label="Shortcuts" controls="never">
        {loaded
          ? ['headphones', 'camera', 'notebook', 'weather'].map((name) => (
              <TileButton
                key={name}
                label={name[0].toUpperCase() + name.slice(1)}
                image={`demo/${name}.svg`}
                imagePosition="bottom"
              />
            ))
          : Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}
              >
                <Skeleton width={160} height={160} radius={40} />
                <Skeleton variant="text" width={100} />
              </div>
            ))}
      </Scroller>
      {loaded ? (
        <List>
          <ListItem
            icon="demo/star.svg"
            title="Pick what you're into"
            subtitle="Music, cooking, travel"
          />
          <ListItem
            icon="demo/bell.svg"
            title="Turn on reminders"
            subtitle="Plants, trips and more"
          />
          <ListItem icon="demo/gift.svg" title="Invite a friend" subtitle="Share playlists" />
        </List>
      ) : (
        <ListSkeleton />
      )}
    </div>
  );
}

export const WhileLoading: Story = {
  render: () => <LoadingDemo />,
};
