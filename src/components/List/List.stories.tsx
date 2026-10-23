import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRightIcon } from '../../icons';
import { List } from './List';
import { ListItem } from './ListItem';

const meta = {
  title: 'Components/List',
  component: ListItem,
  parameters: {
    docs: {
      description: {
        component:
          'Пункт списка: иконка слева, заголовок и подзаголовок. Без `onClick` и `href` — просто блок, с ними — кнопка или ссылка с подсветкой при наведении. `List` собирает пункты в `<ul>`.',
      },
    },
  },
  args: {
    title: 'Turn on reminders',
    subtitle: "We'll nudge you when it's time to water the plants or pack for a trip",
    icon: 'demo/bell.svg',
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
        icon="demo/star.svg"
        title="Pick what you're into"
        subtitle="Music, cooking, travel — we'll build the home screen around it"
      />
      <ListItem
        size="lg"
        icon="demo/bell.svg"
        title="Turn on reminders"
        subtitle="We'll nudge you when it's time to water the plants or pack for a trip"
      />
      <ListItem
        size="lg"
        icon="demo/gift.svg"
        title="Invite a friend"
        subtitle="Share playlists and recipes with people you like"
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
          icon="demo/star.svg"
          title={`Size ${size}`}
          subtitle="Music, cooking, travel — we'll build the home screen around it"
        />
      ))}
    </List>
  ),
};

export const Interactive: Story = {
  render: () => (
    <List dividers>
      <ListItem
        icon="demo/user.svg"
        title="Profile"
        subtitle="Name, avatar, interests"
        after={<ChevronRightIcon />}
        onClick={() => {}}
      />
      <ListItem
        icon="demo/bell.svg"
        title="Notifications"
        subtitle="Reminders and weekly digest"
        after={<ChevronRightIcon />}
        href="#"
      />
      <ListItem
        icon="demo/cloud.svg"
        title="Backup"
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
