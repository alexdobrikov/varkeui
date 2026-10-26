import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlusIcon } from '../../icons';
import { BentoCard } from '../Bento';
import { SectionHeader } from '../SectionHeader';
import { TileButton } from '../TileButton';
import { Scroller } from './Scroller';

const meta = {
  title: 'Components/Scroller',
  component: Scroller,
  args: { gap: 16, snap: true, controls: 'auto', fade: true },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof Scroller>;

export default meta;
type Story = StoryObj<typeof meta>;

const shortcuts = [
  { label: 'Daily playlist', image: 'demo/headphones.svg' },
  { label: 'Photo walks', image: 'demo/camera.svg', add: true },
  { label: 'Quick note', image: 'demo/notebook.svg', add: true },
  { label: 'Weather', image: 'demo/weather.svg' },
  { label: 'Watering schedule', image: 'demo/plant.svg' },
  { label: 'Calendar', image: 'demo/calendar.svg' },
  { label: 'Recipes', image: 'demo/bowl.svg' },
  { label: 'Workouts', image: 'demo/dumbbell.svg' },
  { label: 'Reading list', image: 'demo/books.svg' },
  { label: 'Trips', image: 'demo/plane.svg', add: true },
];

const trips = [
  { label: 'Mountains', image: 'demo/mountains.svg' },
  { label: 'Seaside', image: 'demo/beach.svg' },
  { label: 'City break', image: 'demo/city.svg' },
  { label: 'Mountains again', image: 'demo/mountains.svg' },
  { label: 'Another beach', image: 'demo/beach.svg' },
];

export const Playground: Story = {
  args: { 'aria-label': 'Shortcuts' },
  render: (args) => (
    <Scroller {...args}>
      {shortcuts.map(({ label, image, add }) => (
        <TileButton
          key={label}
          label={label}
          image={image}
          imagePosition="bottom"
          variant={add ? 'outlined' : 'filled'}
          badge={add ? <PlusIcon /> : undefined}
        />
      ))}
    </Scroller>
  ),
};

export const Hub: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SectionHeader title="Shortcuts" href="#" />
        <Scroller aria-label="Shortcuts" style={{ '--vui-scroller-button-top': '80px' } as never}>
          {shortcuts.map(({ label, image, add }) => (
            <TileButton
              key={label}
              label={label}
              image={image}
              imagePosition="bottom"
              variant={add ? 'outlined' : 'filled'}
              badge={add ? <PlusIcon /> : undefined}
              labelLines={1}
            />
          ))}
        </Scroller>
      </section>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SectionHeader title="Trips" href="#" subtitle="Ideas for the next weekend" />
        <Scroller aria-label="Trips" style={{ '--vui-scroller-button-top': '80px' } as never}>
          {trips.map(({ label, image }) => (
            <TileButton
              key={label}
              label={label}
              image={image}
              imageFit="cover"
              width={352}
              aspectRatio={2.2}
            />
          ))}
        </Scroller>
      </section>
    </div>
  ),
};

export const FullBleed: Story = {
  render: () => (
    <div style={{ margin: '0 -32px' }}>
      <SectionHeader title="Explore" href="#" style={{ padding: '0 32px 20px' }} />
      <Scroller aria-label="Explore" inset={32} gap={12}>
        {shortcuts.slice(0, 8).map(({ label, image }) => (
          <BentoCard
            key={label}
            href="#"
            title={label}
            image={image}
            style={{ width: 240, height: 200 }}
          />
        ))}
      </Scroller>
    </div>
  ),
};

export const AlwaysVisibleControls: Story = {
  render: () => (
    <Scroller
      aria-label="Trips"
      controls="always"
      snap={false}
      gap={12}
      style={{ '--vui-scroller-button-top': '70px' } as never}
    >
      {[...trips, ...trips].map(({ label, image }, index) => (
        <TileButton
          key={index}
          label={label}
          image={image}
          imageFit="cover"
          width={280}
          aspectRatio={2}
        />
      ))}
    </Scroller>
  ),
};
