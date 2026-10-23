import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlusIcon } from '../../icons';
import { TileButton } from './TileButton';

const meta = {
  title: 'Components/TileButton',
  component: TileButton,
  args: {
    label: 'Family card',
    image: 'demo/card.svg',
    variant: 'filled',
    size: 'lg',
    imagePosition: 'bottom',
  },
  argTypes: {
    image: { control: 'text' },
    badge: { control: false },
  },
} satisfies Meta<typeof TileButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 32, flexWrap: 'wrap' } as const;

export const Playground: Story = {};

export const Outlined: Story = {
  args: { variant: 'outlined', badge: <PlusIcon /> },
};

export const Gallery: Story = {
  render: () => (
    <div style={row}>
      <TileButton label="Start saving with Savers" image="demo/bag.svg" imagePosition="bottom" />
      <TileButton
        label="Cashback for a month"
        image="demo/basket.svg"
        variant="outlined"
        badge={<PlusIcon />}
        imagePosition="bottom"
      />
      <TileButton
        label="Family card"
        image="demo/card.svg"
        variant="outlined"
        badge={<PlusIcon />}
        imagePosition="bottom"
      />
      <TileButton label="Cards and accounts" image="demo/wallet.svg" imagePosition="bottom" />
      <TileButton label="Payment history" image="demo/folder.svg" imagePosition="bottom" />
    </div>
  ),
};

export const ImagePositions: Story = {
  render: () => (
    <div style={row}>
      {(
        ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'left', 'right'] as const
      ).map((position) => (
        <TileButton
          key={position}
          label={position}
          image="demo/card.svg"
          imageSize="70%"
          imagePosition={position}
          size="md"
        />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ ...row, alignItems: 'flex-start' }}>
      <TileButton size="sm" label="Small" image="demo/wallet.svg" imagePosition="bottom" />
      <TileButton size="md" label="Medium" image="demo/wallet.svg" imagePosition="bottom" />
      <TileButton size="lg" label="Large" image="demo/wallet.svg" imagePosition="bottom" />
    </div>
  ),
};

export const SingleLineLabels: Story = {
  render: () => (
    <div style={{ ...row, gap: 16 }}>
      <TileButton label="All" image="demo/folder.svg" imagePosition="bottom" labelLines={1} />
      {['Passport', 'International passport', "Driver's license", 'Mandatory insurance'].map(
        (label) => (
          <TileButton
            key={label}
            label={label}
            image="demo/passport.svg"
            imagePosition="bottom"
            variant="outlined"
            badge={<PlusIcon />}
            labelLines={1}
          />
        ),
      )}
    </div>
  ),
};

export const Wide: Story = {
  render: () => (
    <div style={{ ...row, gap: 16 }}>
      <TileButton
        label="Home"
        image="demo/map.svg"
        imageFit="cover"
        width={352}
        aspectRatio={2.2}
        badge={<PlusIcon />}
      />
      <TileButton
        label="Work"
        image="demo/map.svg"
        imageFit="cover"
        width={352}
        aspectRatio={2.2}
        badge={<PlusIcon />}
      />
      <TileButton
        label="Other"
        image="demo/map.svg"
        imageFit="cover"
        width={352}
        aspectRatio={2.2}
      />
    </div>
  ),
};

export const FluidGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 900 }}>
      {['Home', 'Work', 'Other'].map((label) => (
        <TileButton
          key={label}
          label={label}
          image="demo/map.svg"
          imageFit="cover"
          aspectRatio={2.2}
          block
        />
      ))}
    </div>
  ),
};

export const AsLink: Story = {
  args: { href: '#', label: 'Payment history', image: 'demo/folder.svg' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
