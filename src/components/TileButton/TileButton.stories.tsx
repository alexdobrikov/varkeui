import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlusIcon } from '../../icons';
import { TileButton } from './TileButton';

const meta = {
  title: 'Components/TileButton',
  component: TileButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Плитка с картинкой внутри и подписью снизу. `filled` и `outlined` одного размера — обводка внутренняя. Бейдж в углу вырезает выемку цвета `--vui-color-bg`.',
      },
    },
  },
  args: {
    label: 'Music',
    image: 'demo/headphones.svg',
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
  args: { variant: 'outlined', badge: <PlusIcon />, label: 'New playlist' },
};

export const Gallery: Story = {
  render: () => (
    <div style={row}>
      <TileButton label="Music" image="demo/headphones.svg" imagePosition="bottom" />
      <TileButton
        label="Photo of the day"
        image="demo/camera.svg"
        variant="outlined"
        badge={<PlusIcon />}
        imagePosition="bottom"
      />
      <TileButton
        label="Quick note"
        image="demo/notebook.svg"
        variant="outlined"
        badge={<PlusIcon />}
        imagePosition="bottom"
      />
      <TileButton label="Weather" image="demo/weather.svg" imagePosition="bottom" />
      <TileButton label="Watering schedule" image="demo/plant.svg" imagePosition="bottom" />
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
          image="demo/calendar.svg"
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
      <TileButton size="sm" label="Small" image="demo/plant.svg" imagePosition="bottom" />
      <TileButton size="md" label="Medium" image="demo/plant.svg" imagePosition="bottom" />
      <TileButton size="lg" label="Large" image="demo/plant.svg" imagePosition="bottom" />
    </div>
  ),
};

export const SingleLineLabels: Story = {
  render: () => (
    <div style={{ ...row, gap: 16 }}>
      <TileButton label="All recipes" image="demo/bowl.svg" imagePosition="bottom" labelLines={1} />
      {[
        { label: 'Breakfast', image: 'demo/bowl.svg' },
        { label: 'Weekend workouts', image: 'demo/dumbbell.svg' },
        { label: 'Reading list', image: 'demo/books.svg' },
        { label: 'Trips to plan this year', image: 'demo/plane.svg' },
      ].map(({ label, image }) => (
        <TileButton
          key={label}
          label={label}
          image={image}
          imagePosition="bottom"
          variant="outlined"
          badge={<PlusIcon />}
          labelLines={1}
        />
      ))}
    </div>
  ),
};

const trips = [
  { label: 'Mountains', image: 'demo/mountains.svg' },
  { label: 'Seaside', image: 'demo/beach.svg' },
  { label: 'City break', image: 'demo/city.svg' },
];

export const Wide: Story = {
  render: () => (
    <div style={{ ...row, gap: 16 }}>
      {trips.map(({ label, image }, index) => (
        <TileButton
          key={label}
          label={label}
          image={image}
          imageFit="cover"
          width={352}
          aspectRatio={2.2}
          badge={index < 2 ? <PlusIcon /> : undefined}
        />
      ))}
    </div>
  ),
};

export const FluidGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 900 }}>
      {trips.map(({ label, image }) => (
        <TileButton
          key={label}
          label={label}
          image={image}
          imageFit="cover"
          aspectRatio={2.2}
          block
        />
      ))}
    </div>
  ),
};

export const AsLink: Story = {
  args: { href: '#', label: 'Reading list', image: 'demo/books.svg' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
