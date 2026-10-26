import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { PromoCard } from './PromoCard';
import { PromoCarousel } from './PromoCarousel';

const slides = [
  <PromoCard
    key="boost"
    title="Reach more readers"
    description="Boost your posts and find a new audience"
    image="/demo/rocket.svg"
    action={<Button>Try it</Button>}
  />,
  <PromoCard
    key="sale"
    background="linear-gradient(160deg, #ffd9b8 0%, #f08a5d 100%)"
    tone="light"
    title="Weekend sale"
    description="Up to 40% off on headphones and speakers"
    image="/demo/headphones.svg"
    action={<Button>See deals</Button>}
  />,
  <PromoCard
    key="invite"
    background="linear-gradient(180deg, #0b1023 0%, #2f6bff 100%)"
    title="Invite a friend"
    description="You both get a month of premium"
    image="/demo/gift.svg"
    action={<Button>Share link</Button>}
  />,
];

const meta = {
  title: 'Components/PromoCarousel',
  component: PromoCarousel,
  args: {
    autoPlay: true,
    interval: 6000,
    stacked: true,
    'aria-label': 'Offers',
  },
  argTypes: { children: { control: false } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400, paddingInline: 20 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <PromoCarousel {...args}>{slides}</PromoCarousel>,
} satisfies Meta<typeof PromoCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Manual: Story = {
  args: { autoPlay: false },
};

export const Flat: Story = {
  args: { stacked: false },
};

export const Wide: Story = {
  decorators: [
    (Story) => (
      <div style={{ paddingInline: 20 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <PromoCarousel {...args}>
      {slides.map((slide) => (
        <PromoCard key={slide.key} {...slide.props} size="lg" />
      ))}
    </PromoCarousel>
  ),
};
