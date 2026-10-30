import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { SegmentedControl } from '../SegmentedControl';
import { Sidebar, SidebarGroup, SidebarMain, SidebarSeparator } from './Sidebar';
import { SidebarItem } from './SidebarItem';
import { SidebarBrand, SidebarCollapseButton, SidebarTrigger } from './SidebarParts';
import { SidebarProvider } from './SidebarProvider';

const icon = (d: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {d}
  </svg>
);

const HomeIcon = icon(<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />);
const BookIcon = icon(<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11" />);
const CalendarIcon = icon(
  <>
    <rect x="4" y="5" width="16" height="15" rx="3" />
    <path d="M8 3v4M16 3v4M4 10h16" />
  </>,
);
const SettingsIcon = icon(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
  </>,
);
const LogoutIcon = icon(
  <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10" />,
);

const Logo = (
  <svg viewBox="0 0 40 40">
    <rect width="40" height="40" fill="#e5484d" />
    <path d="M20 9l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fff" />
  </svg>
);

const SECTIONS = [
  { id: 'home', label: 'Главная', icon: HomeIcon },
  { id: 'lessons', label: 'Уроки', icon: BookIcon },
  { id: 'calendar', label: 'Календарь', icon: CalendarIcon, badge: 3 },
];

function Demo({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const [section, setSection] = useState('home');
  const [theme, setTheme] = useState('dark');
  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed} style={{ minHeight: 560 }}>
      <Sidebar
        header={
          <>
            <SidebarBrand logo={Logo} title="Студия" subtitle="Кабинет" href="#" />
            <SidebarCollapseButton />
          </>
        }
        footer={
          <SegmentedControl
            block
            size="sm"
            value={theme}
            onValueChange={setTheme}
            options={[
              { value: 'light', label: 'Светлая' },
              { value: 'dark', label: 'Тёмная' },
            ]}
          />
        }
      >
        <SidebarGroup>
          {SECTIONS.map((s) => (
            <SidebarItem
              key={s.id}
              label={s.label}
              icon={s.icon}
              badge={s.badge}
              active={section === s.id}
              onClick={() => setSection(s.id)}
            />
          ))}
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup label="Аккаунт">
          <SidebarItem label="Настройки" icon={SettingsIcon} href="#" />
          <SidebarItem label="Выйти" icon={LogoutIcon} danger onClick={() => {}} />
        </SidebarGroup>
      </Sidebar>
      <SidebarMain style={{ padding: 24 }}>
        <SidebarTrigger />
        <h2 style={{ margin: '8px 0', fontFamily: 'var(--vui-font-family)' }}>
          {SECTIONS.find((s) => s.id === section)?.label}
        </h2>
        <p style={{ color: 'var(--vui-color-text-muted)', fontFamily: 'var(--vui-font-family)' }}>
          Сузьте окно до телефона — меню спрячется за кнопку и будет выезжать слева.
        </p>
      </SidebarMain>
    </SidebarProvider>
  );
}

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Demo /> };

export const Collapsed: Story = { render: () => <Demo defaultCollapsed /> };

export const Mobile: Story = {
  render: () => <Demo />,
  globals: { viewport: { value: 'mobile1' } },
};
