import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { StatusScreen } from './StatusScreen';

const meta = {
  title: 'Components/StatusScreen',
  component: StatusScreen,
  args: {
    title: 'Page not found',
    description: 'The link may be broken or the page was removed. Check the address or go home.',
    eyebrow: <Badge tone="danger">Error 404</Badge>,
    actions: (
      <>
        <Button block>Go home</Button>
        <Button block variant="secondary">
          Contact support
        </Button>
      </>
    ),
  },
  argTypes: {
    eyebrow: { control: false },
    icon: { control: false },
    actions: { control: false },
  },
} satisfies Meta<typeof StatusScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NoAccess: Story = {
  args: {
    title: 'This area is for teachers',
    description: 'Your account is a student one. Switch the account type in settings to continue.',
    eyebrow: <Badge tone="danger">Error 403</Badge>,
    actions: (
      <>
        <Button block size="lg">
          Switch account type
        </Button>
        <Button block size="lg" variant="secondary">
          Back to dashboard
        </Button>
      </>
    ),
  },
};

export const CenteredEmpty: Story = {
  args: {
    align: 'center',
    actionsLayout: 'row',
    eyebrow: undefined,
    icon: (
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M3 10h18" />
      </svg>
    ),
    title: 'No lessons yet',
    description: 'Create the first lesson and it will appear here.',
    actions: (
      <>
        <Button>Create a lesson</Button>
        <Button variant="secondary">Open templates</Button>
      </>
    ),
  },
};
