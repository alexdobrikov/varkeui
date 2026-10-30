import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar, SidebarGroup, SidebarMain } from './Sidebar';
import { SidebarItem } from './SidebarItem';
import { SidebarBrand, SidebarCollapseButton, SidebarTrigger } from './SidebarParts';
import { SidebarProvider } from './SidebarProvider';

function Setup({ onSelect = () => {} }: { onSelect?: () => void }) {
  return (
    <SidebarProvider>
      <Sidebar header={<SidebarBrand title="Студия" href="/" />}>
        <SidebarGroup>
          <SidebarItem label="Главная" href="/" active />
          <SidebarItem label="Уроки" onClick={onSelect} badge={5} />
        </SidebarGroup>
      </Sidebar>
      <SidebarMain>
        <SidebarTrigger />
        <SidebarCollapseButton />
      </SidebarMain>
    </SidebarProvider>
  );
}

describe('Sidebar', () => {
  it('renders a navigation landmark with links and buttons', () => {
    render(<Setup />);
    expect(screen.getByRole('navigation', { name: 'Меню' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Главная' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /Уроки/ })).toHaveTextContent('5');
  });

  it('opens with the trigger and closes after picking an item', async () => {
    const onSelect = vi.fn();
    const { container } = render(<Setup onSelect={onSelect} />);
    const aside = container.querySelector('.vui-sidebar')!;
    const trigger = screen.getByRole('button', { name: 'Открыть меню' });

    await userEvent.click(trigger);
    expect(aside).toHaveClass('vui-sidebar--open');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(screen.getByRole('button', { name: /Уроки/ }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(aside).not.toHaveClass('vui-sidebar--open');
  });

  it('closes on Escape and on overlay click', async () => {
    const { container } = render(<Setup />);
    const aside = container.querySelector('.vui-sidebar')!;
    await userEvent.click(screen.getByRole('button', { name: 'Открыть меню' }));
    await userEvent.keyboard('{Escape}');
    expect(aside).not.toHaveClass('vui-sidebar--open');

    await userEvent.click(screen.getByRole('button', { name: 'Открыть меню' }));
    await userEvent.click(container.querySelector('.vui-sidebar-overlay')!);
    expect(aside).not.toHaveClass('vui-sidebar--open');
  });

  it('collapses to icons and shows labels as tooltips', async () => {
    const { container } = render(<Setup />);
    await userEvent.click(screen.getByRole('button', { name: 'Свернуть меню' }));
    expect(container.querySelector('.vui-sidebar')).toHaveClass('vui-sidebar--collapsed');
    expect(screen.getByRole('link', { name: 'Главная' })).toHaveAttribute('title', 'Главная');
    expect(screen.getByRole('button', { name: 'Развернуть меню' })).toBeInTheDocument();
  });

  it('reports collapsed changes in controlled mode', async () => {
    const onCollapsedChange = vi.fn();
    render(
      <SidebarProvider collapsed={false} onCollapsedChange={onCollapsedChange}>
        <SidebarCollapseButton />
      </SidebarProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Свернуть меню' }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });
});
