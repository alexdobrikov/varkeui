import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type AnchorHTMLAttributes } from 'react';
import { ArrowRightIcon, CloseIcon, PlusIcon, SearchIcon, TrashIcon } from '../../icons';
import { Button } from './Button';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Save changes',
    variant: 'primary',
    size: 'md',
  },
  argTypes: {
    startIcon: { control: false },
    endIcon: { control: false },
    as: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' } as const;

function OrbitLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="orbit-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#orbit-logo)" />
      <ellipse
        cx="12"
        cy="12"
        rx="8"
        ry="3.5"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        transform="rotate(-30 12 12)"
      />
      <circle cx="12" cy="12" r="3" fill="#fff" />
    </svg>
  );
}

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={row}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={row}>
      <Button startIcon={<PlusIcon />}>New playlist</Button>
      <Button variant="secondary" endIcon={<ArrowRightIcon />}>
        Continue
      </Button>
      <Button variant="outline" startIcon={<SearchIcon />}>
        Search
      </Button>
      <Button variant="danger" startIcon={<TrashIcon />}>
        Delete
      </Button>
    </div>
  ),
};

export const SignIn: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 380 }}>
      <Button variant="secondary" size="lg" block startIcon={<OrbitLogo />}>
        Sign in with Orbit ID
      </Button>
      <Button variant="outline" size="lg" block startIcon={<OrbitLogo />}>
        Sign in with Orbit ID
      </Button>
      <Button variant="primary" size="lg" block startIcon={<OrbitLogo />}>
        Sign in with Orbit ID
      </Button>
    </div>
  ),
};

function LoadingDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <div style={row}>
      <Button
        loading={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1500);
        }}
      >
        Click to save
      </Button>
      <Button loading variant="secondary">
        Saving
      </Button>
      <Button loading variant="outline">
        Saving
      </Button>
      <IconButton loading aria-label="Searching" icon={<SearchIcon />} />
    </div>
  );
}

export const Loading: Story = {
  render: () => <LoadingDemo />,
};

export const IconButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={row}>
        <IconButton aria-label="Add" icon={<PlusIcon />} variant="primary" />
        <IconButton aria-label="Search" icon={<SearchIcon />} />
        <IconButton aria-label="Close" icon={<CloseIcon />} variant="outline" />
        <IconButton aria-label="Next" icon={<ArrowRightIcon />} variant="ghost" />
        <IconButton aria-label="Delete" icon={<TrashIcon />} variant="danger" />
      </div>
      <div style={row}>
        <IconButton aria-label="Add" icon={<PlusIcon />} size="sm" />
        <IconButton aria-label="Add" icon={<PlusIcon />} size="md" />
        <IconButton aria-label="Add" icon={<PlusIcon />} size="lg" />
      </div>
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

export const AsLink: Story = {
  render: () => (
    <div style={row}>
      <Button href="#" variant="outline" endIcon={<ArrowRightIcon />}>
        Regular link
      </Button>
      <Button as={RouterLink} to="/settings" variant="secondary">
        Router link
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={row}>
      <Button disabled>Primary</Button>
      <Button disabled variant="secondary">
        Secondary
      </Button>
      <Button disabled variant="outline">
        Outline
      </Button>
      <Button disabled href="#" variant="ghost">
        Link
      </Button>
    </div>
  ),
};

export const Readme: Story = {
  tags: ['!dev', '!autodocs'],
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 560 }}>
      <div style={row}>
        <Button startIcon={<PlusIcon />}>New playlist</Button>
        <Button variant="secondary" endIcon={<ArrowRightIcon />}>
          Continue
        </Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div style={row}>
        <Button variant="danger" startIcon={<TrashIcon />}>
          Delete
        </Button>
        <Button loading variant="secondary">
          Saving
        </Button>
        <IconButton aria-label="Search" icon={<SearchIcon />} />
        <IconButton aria-label="Close" icon={<CloseIcon />} variant="outline" />
      </div>
      <Button variant="secondary" size="lg" block startIcon={<OrbitLogo />}>
        Sign in with Orbit ID
      </Button>
    </div>
  ),
};
