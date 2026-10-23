import type { Meta, StoryObj } from '@storybook/react-vite';
import type { AnchorHTMLAttributes } from 'react';
import { BentoCard } from './BentoCard';
import { BentoGrid } from './BentoGrid';

const meta = {
  title: 'Components/Bento',
  component: BentoGrid,
  parameters: {
    docs: {
      description: {
        component:
          '`BentoGrid` задаёт колонки, высоту строки и отступ, `BentoCard` — сколько колонок и строк занимает. Все размеры можно задать по брейкпоинтам: `{ base: 2, md: 6 }`. Брейкпоинты считаются от ширины самой сетки. С `href` карточка — ссылка, с `onClick` — кнопка, с `as={Link}` — ссылка роутера.',
      },
    },
  },
} satisfies Meta<typeof BentoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const hobbies = [
  { title: 'Daily playlist', image: 'demo/headphones.svg', span: 2 },
  { title: 'Photo walks', image: 'demo/camera.svg', span: 2 },
  { title: 'Plant care', image: 'demo/plant.svg', span: 2 },
  { title: 'Recipes for the week', image: 'demo/bowl.svg', span: 3 },
  { title: 'Workouts', image: 'demo/dumbbell.svg', span: 3 },
  { title: 'Reading list', image: 'demo/books.svg', span: 2 },
  { title: 'Notes', image: 'demo/notebook.svg', span: 2 },
  { title: 'Trips', image: 'demo/plane.svg', span: 2 },
];

export const Hobbies: Story = {
  render: () => (
    <div style={{ maxWidth: 760 }}>
      <BentoGrid columns={{ base: 2, sm: 6 }} rowHeight={{ base: 180, sm: 220 }}>
        {hobbies.map(({ title, image, span }) => (
          <BentoCard
            key={title}
            href="#"
            title={title}
            image={image}
            imageSize="70%"
            colSpan={{ base: 1, sm: span }}
          />
        ))}
      </BentoGrid>
    </div>
  ),
};

export const Classic: Story = {
  render: () => (
    <BentoGrid columns={{ base: 1, sm: 2, lg: 4 }} rowHeight={200} dense style={{ maxWidth: 1100 }}>
      <BentoCard
        href="#"
        title="Weekend in the mountains"
        description="Three trails, a cabin and a playlist for the road"
        image="demo/mountains.svg"
        imageFit="cover"
        imageSize="100%"
        colSpan={{ sm: 2 }}
        rowSpan={2}
        style={{ color: '#1e1b4b' }}
      />
      <BentoCard href="#" title="Weather" image="demo/weather.svg" />
      <BentoCard href="#" title="Calendar" image="demo/calendar.svg" />
      <BentoCard
        href="#"
        title="Recipes for the week"
        description="Seven dinners, one shopping list"
        image="demo/bowl.svg"
        colSpan={{ sm: 2 }}
        imageSize="60%"
        background="linear-gradient(160deg, #fef3c7, #fed7aa)"
        style={{ color: '#431407' }}
      />
      <BentoCard
        href="#"
        title="City break"
        image="demo/city.svg"
        imageFit="cover"
        imagePosition="center"
        imageSize="100%"
        colSpan={{ sm: 2, lg: 3 }}
        style={{ color: '#fff' }}
      />
      <BentoCard href="#" title="Music" image="demo/headphones.svg" />
    </BentoGrid>
  ),
};

export const ImagePositions: Story = {
  render: () => (
    <BentoGrid columns={{ base: 2, md: 3 }} rowHeight={180} style={{ maxWidth: 900 }}>
      {(['bottom-right', 'bottom-left', 'bottom', 'top-right', 'right', 'center'] as const).map(
        (position) => (
          <BentoCard
            key={position}
            title={position}
            image="demo/camera.svg"
            imagePosition={position}
            imageSize="60%"
          />
        ),
      )}
    </BentoGrid>
  ),
};

function RouterLink({ to, ...props }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      href={to}
      onClick={(event) => {
        event.preventDefault();
        alert(`navigate(${to})`);
      }}
    />
  );
}

export const AsRouterLink: Story = {
  render: () => (
    <BentoGrid columns={3} rowHeight={180} style={{ maxWidth: 760 }}>
      <BentoCard as={RouterLink} to="/music" title="Music" image="demo/headphones.svg" />
      <BentoCard as={RouterLink} to="/plants" title="Plant care" image="demo/plant.svg" />
      <BentoCard title="Trips" description="Coming soon" image="demo/plane.svg" href="#" disabled />
    </BentoGrid>
  ),
};
