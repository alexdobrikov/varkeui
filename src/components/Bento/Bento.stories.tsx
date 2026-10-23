import type { Meta, StoryObj } from '@storybook/react-vite';
import type { AnchorHTMLAttributes } from 'react';
import { BentoCard } from './BentoCard';
import { BentoGrid } from './BentoGrid';

const meta = {
  title: 'Components/Bento',
  component: BentoGrid,
  tags: ['autodocs'],
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

const services = [
  { title: 'Dry cleaning of clothes', image: 'demo/sweater.svg', span: 2 },
  { title: 'Furniture dry cleaning', image: 'demo/sofa.svg', span: 2 },
  { title: 'Water delivery', image: 'demo/bottle.svg', span: 2 },
  { title: 'Medical tests', image: 'demo/microscope.svg', span: 3 },
  { title: 'PCR tests', image: 'demo/mask.svg', span: 3 },
  { title: 'Shoe repair', image: 'demo/boots.svg', span: 2 },
  { title: 'Furniture repair', image: 'demo/dresser.svg', span: 2 },
  { title: 'Electrics', image: 'demo/socket.svg', span: 2 },
];

export const Services: Story = {
  render: () => (
    <div style={{ maxWidth: 760 }}>
      <BentoGrid columns={{ base: 2, sm: 6 }} rowHeight={{ base: 180, sm: 220 }}>
        {services.map(({ title, image, span }) => (
          <BentoCard
            key={title}
            href="#"
            title={title}
            image={image}
            imageSize="75%"
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
        title="Water delivery"
        description="19 litres to your door tomorrow"
        image="demo/bottle.svg"
        colSpan={{ sm: 2 }}
        rowSpan={2}
        imageSize="80%"
        background="linear-gradient(160deg, #d9ecff, #a9cdf2)"
        style={{ color: '#1c1b20' }}
      />
      <BentoCard href="#" title="Shoe repair" image="demo/boots.svg" />
      <BentoCard href="#" title="Electrics" image="demo/socket.svg" />
      <BentoCard
        href="#"
        title="Furniture repair"
        description="Masters with their own tools"
        image="demo/dresser.svg"
        colSpan={{ sm: 2 }}
        imageSize="60%"
      />
      <BentoCard href="#" title="PCR tests" image="demo/mask.svg" colSpan={{ sm: 2, lg: 3 }} />
      <BentoCard href="#" title="Dry cleaning" image="demo/sweater.svg" />
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
            image="demo/sofa.svg"
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
      <BentoCard as={RouterLink} to="/cleaning" title="Dry cleaning" image="demo/sweater.svg" />
      <BentoCard as={RouterLink} to="/water" title="Water delivery" image="demo/bottle.svg" />
      <BentoCard
        title="Electrics"
        description="Coming soon"
        image="demo/socket.svg"
        href="#"
        disabled
      />
    </BentoGrid>
  ),
};
