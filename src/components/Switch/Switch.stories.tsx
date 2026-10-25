import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Badge } from '../Badge';
import { List, ListItem } from '../List';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { size: 'md', defaultChecked: true, 'aria-label': 'Notifications' },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' } as const;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={row}>
        <Switch aria-label="Off" />
        <Switch aria-label="On" defaultChecked />
        <Switch aria-label="Disabled off" disabled />
        <Switch aria-label="Disabled on" disabled defaultChecked />
      </div>
      <div style={row}>
        <Switch size="sm" aria-label="Small off" />
        <Switch size="sm" aria-label="Small on" defaultChecked />
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <Switch label="Dark mode" defaultChecked />
      <Switch label="Weekly digest" labelPosition="end" />
    </div>
  ),
};

function SettingsDemo() {
  const [reminders, setReminders] = useState(true);
  return (
    <List dividers style={{ maxWidth: 520 }}>
      <ListItem
        as="label"
        icon="demo/bell.svg"
        title="Reminders"
        subtitle={reminders ? 'We will nudge you on time' : 'Turned off'}
        after={<Switch checked={reminders} onCheckedChange={setReminders} />}
      />
      <ListItem
        as="label"
        icon="demo/cloud.svg"
        title="Backup photos"
        subtitle="Only over Wi‑Fi"
        after={<Switch defaultChecked />}
      />
      <ListItem
        href="#"
        icon="demo/gift.svg"
        title="Invitations"
        subtitle="Friends who joined"
        after={<Badge tone="danger" count={3} />}
      />
      <ListItem
        as="label"
        icon="demo/user.svg"
        title="Private profile"
        subtitle="Coming soon"
        after={<Switch disabled />}
        disabled
      />
    </List>
  );
}

export const SettingsList: Story = {
  render: () => <SettingsDemo />,
};
