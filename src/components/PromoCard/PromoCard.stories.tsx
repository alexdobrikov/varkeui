import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { PromoCard } from './PromoCard';
import { PromoCarousel } from './PromoCarousel';

const meta = {
  title: 'Components/PromoCard',
  component: PromoCard,
  args: {
    title: 'Reach more readers',
    description: 'Boost your posts and find a new audience',
    image: 'demo/rocket.svg',
    imageBleed: true,
    tone: 'dark',
    size: 'md',
    action: <Button size="lg">Try it</Button>,
    onClose: () => {},
  },
  argTypes: {
    action: { control: false },
    image: { control: false },
    title: { control: 'text' },
    description: { control: 'text' },
  },
} satisfies Meta<typeof PromoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const phone = { maxWidth: 380 };

export const Playground: Story = {
  decorators: [
    (Story) => (
      <div style={{ ...phone, paddingTop: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export const Tones: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 16,
      }}
    >
      <PromoCard
        tone="dark"
        title="Reach more readers"
        description="Boost your posts and find a new audience"
        image="demo/rocket.svg"
        action={<Button size="lg">Try it</Button>}
      />
      <PromoCard
        tone="light"
        title="Invite a friend"
        description="You both get a month of premium"
        image="demo/gift.svg"
        action={<Button size="lg">Share link</Button>}
      />
      <PromoCard
        tone="neutral"
        title="Plan your trip"
        description="Tickets, hotels and routes in one place"
        image="demo/plane.svg"
        action={<Button size="lg">Open planner</Button>}
      />
    </div>
  ),
};

export const CustomBackground: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 16,
      }}
    >
      <PromoCard
        tone="dark"
        background="linear-gradient(135deg, #ff8a5c 0%, #c2185b 100%)"
        title="Weekend sale"
        description="Up to 40% off on headphones"
        image="demo/headphones.svg"
        action={<Button size="lg">See deals</Button>}
      />
      <PromoCard
        tone="light"
        background="linear-gradient(135deg, #d9f99d 0%, #67e8f9 100%)"
        title="Grow a garden"
        description="Daily reminders to water your plants"
        image="demo/plant.svg"
        action={<Button size="lg">Turn on</Button>}
      />
    </div>
  ),
};

export const Wide: Story = {
  render: () => (
    <PromoCard
      size="lg"
      title="Reach more readers"
      description="Boost your posts and find a new audience in a couple of clicks"
      image="demo/rocket.svg"
      action={
        <>
          <Button size="lg">Try it</Button>
          <Button size="lg" variant="ghost">
            Learn more
          </Button>
        </>
      }
      onClose={() => {}}
    />
  ),
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        alignItems: 'start',
        gap: 16,
      }}
    >
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <PromoCard
          key={size}
          size={size}
          title="Reach more readers"
          description={`size="${size}"`}
          image="demo/rocket.svg"
          action={<Button size={size === 'sm' ? 'md' : 'lg'}>Try it</Button>}
        />
      ))}
    </div>
  ),
};

function DismissDemo() {
  const [visible, setVisible] = useState(true);
  if (!visible)
    return (
      <Button variant="secondary" size="sm" onClick={() => setVisible(true)}>
        Show the card again
      </Button>
    );
  return (
    <div style={{ ...phone, paddingTop: 24 }}>
      <PromoCard
        title="Reach more readers"
        description="Boost your posts and find a new audience"
        image="demo/rocket.svg"
        imageBleed
        action={<Button size="lg">Try it</Button>}
        onClose={() => setVisible(false)}
      />
    </div>
  );
}

export const Dismissible: Story = {
  render: () => <DismissDemo />,
};

export const Readme: Story = {
  tags: ['!dev', '!autodocs'],
  render: () => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
      <div style={{ width: 360, paddingTop: 24 }}>
        <PromoCard
          title="Reach more readers"
          description="Boost your posts and find a new audience"
          image="demo/rocket.svg"
          imageBleed
          action={<Button size="lg">Try it</Button>}
          onClose={() => {}}
        />
      </div>
      <div style={{ width: 360, paddingTop: 24 }}>
        <PromoCarousel autoPlay={false} aria-label="Offers">
          <PromoCard
            tone="light"
            background="linear-gradient(160deg, #ffd9b8 0%, #f08a5d 100%)"
            title="Weekend sale"
            description="Up to 40% off on headphones"
            image="demo/headphones.svg"
            action={<Button size="lg">See deals</Button>}
          />
          <PromoCard title="Invite a friend" action={<Button size="lg">Share link</Button>} />
        </PromoCarousel>
      </div>
    </div>
  ),
};
