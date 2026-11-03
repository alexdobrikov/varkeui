import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarGroup } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { name: 'Anna Petrova', size: 'md' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const people = ['Anna Petrova', 'Ivan', 'Maria Lee', 'Oleg Smirnov', 'Wang Fang', 'Sergey'];

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar name="Anna Petrova" size="sm" />
      <Avatar name="Anna Petrova" size="md" />
      <Avatar name="Anna Petrova" size="lg" />
    </div>
  ),
};

/** Кто в комнате: аватары наезжают друг на друга, лишние — «+N». */
export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AvatarGroup aria-label="In the room">
        {people.slice(0, 3).map((p) => (
          <Avatar key={p} name={p} />
        ))}
      </AvatarGroup>
      <AvatarGroup aria-label="Students" max={4} size="sm">
        {people.map((p) => (
          <Avatar key={p} name={p} />
        ))}
      </AvatarGroup>
    </div>
  ),
};
