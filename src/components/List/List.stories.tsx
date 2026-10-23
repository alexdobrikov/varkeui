import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRightIcon } from '../../icons';
import { List } from './List';
import { ListItem } from './ListItem';

const meta = {
  title: 'Components/List',
  component: ListItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Пункт списка: иконка слева, заголовок и подзаголовок. Без `onClick` и `href` — просто блок, с ними — кнопка или ссылка с подсветкой при наведении. `List` собирает пункты в `<ul>`.',
      },
    },
  },
  args: {
    title: 'Protect your data',
    subtitle: "Verified accounts with enabled face or fingerprint login can't be stolen",
    icon: 'demo/shield.svg',
    size: 'md',
  },
  argTypes: {
    icon: { control: 'text' },
    after: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Onboarding: Story = {
  render: () => (
    <List>
      <ListItem
        size="lg"
        icon="demo/badge.svg"
        title="Add your name and phone number"
        subtitle="We'll know how to address you and notify you about important events"
      />
      <ListItem
        size="lg"
        icon="demo/shield.svg"
        title="Protect your data"
        subtitle="Verified accounts with enabled face or fingerprint login can't be stolen"
      />
      <ListItem
        size="lg"
        icon="demo/heart.svg"
        title="Add family members"
        subtitle="Maximize value across the services for everyone"
      />
    </List>
  ),
};

export const Sizes: Story = {
  render: () => (
    <List>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ListItem
          key={size}
          size={size}
          icon="demo/heart.svg"
          title={`Size ${size}`}
          subtitle="Maximize value across the services for everyone"
        />
      ))}
    </List>
  ),
};

export const Interactive: Story = {
  render: () => (
    <List dividers>
      <ListItem
        icon="demo/badge.svg"
        title="Personal data"
        subtitle="Name, phone number, email"
        after={<ChevronRightIcon />}
        onClick={() => {}}
      />
      <ListItem
        icon="demo/shield.svg"
        title="Security"
        subtitle="Face and fingerprint login"
        after={<ChevronRightIcon />}
        href="#"
      />
      <ListItem
        icon="demo/heart.svg"
        title="Family"
        subtitle="Coming soon"
        after={<ChevronRightIcon />}
        href="#"
        disabled
      />
    </List>
  ),
};

export const TitleOnly: Story = {
  args: { subtitle: undefined, size: 'sm', after: <ChevronRightIcon />, onClick: () => {} },
};
