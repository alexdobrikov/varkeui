import type { Meta, StoryObj } from '@storybook/react-vite';
import type { AnchorHTMLAttributes } from 'react';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { PlusIcon } from '../../icons';
import { SectionHeader } from './SectionHeader';

const meta = {
  title: 'Components/SectionHeader',
  component: SectionHeader,
  args: { title: 'Collections', href: '#', size: 'md' },
  argTypes: { action: { control: false }, linkAs: { control: false } },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 640 } as const;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={column}>
      <SectionHeader title="Collections" href="#" />
      <SectionHeader title="Plain heading" />
      <SectionHeader title="Trips" href="#" subtitle="Ideas for the next weekend" />
      <SectionHeader
        title="Notifications"
        action={
          <Button variant="ghost" size="sm">
            Mark all read
          </Button>
        }
      />
      <SectionHeader title="Inbox" href="#" action={<Badge tone="danger" count={12} />} />
    </div>
  ),
};

/** Кнопка в `action` центрируется по строке заголовка, подзаголовок — под ними. */
export const WithSubtitleAndAction: Story = {
  render: () => (
    <div style={column}>
      <SectionHeader
        title="Lessons"
        subtitle="Your own lessons and the open ones from the library. Homework lives in its own section."
        action={
          <Button size="sm" startIcon={<PlusIcon />}>
            New lesson
          </Button>
        }
      />
      <SectionHeader
        title="Students"
        count={12}
        subtitle="Send the invite link — they appear here once they accept"
        action={
          <Button variant="secondary" size="sm">
            Copy link
          </Button>
        }
      />
    </div>
  ),
};

/** Для README: заголовки секций в разных сочетаниях. */
export const Readme: Story = {
  render: () => (
    <div style={{ ...column, width: 560 }}>
      <SectionHeader
        title="Lessons"
        subtitle="Your own lessons and the open ones from the library"
        action={
          <Button size="sm" startIcon={<PlusIcon />}>
            New lesson
          </Button>
        }
      />
      <SectionHeader title="Collections" count={24} href="#" />
      <SectionHeader
        title="Notifications"
        action={
          <Button variant="ghost" size="sm">
            Mark all read
          </Button>
        }
      />
    </div>
  ),
};

export const WithCount: Story = {
  render: () => (
    <div style={column}>
      <SectionHeader title="Notifications" count={30} />
      <SectionHeader title="Saved places" count={128} href="#" />
      <SectionHeader
        title="Comments"
        count="1.2K"
        action={
          <Button variant="ghost" size="sm">
            Newest first
          </Button>
        }
      />
      <SectionHeader size="lg" title="Photos" count={4096} headingAs="h1" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={column}>
      <SectionHeader size="sm" title="Small" href="#" />
      <SectionHeader size="md" title="Medium" href="#" />
      <SectionHeader size="lg" title="Large" href="#" headingAs="h1" />
    </div>
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

export const WithRouterLink: Story = {
  render: () => (
    <SectionHeader title="Collections" linkAs={RouterLink} linkProps={{ to: '/collections' }} />
  ),
};
