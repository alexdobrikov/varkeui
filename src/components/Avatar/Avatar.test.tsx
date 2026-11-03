import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar, AvatarGroup } from './Avatar';

describe('Avatar', () => {
  it('shows initials and is labelled with the name', () => {
    render(<Avatar name="Anna Petrova" />);
    const avatar = screen.getByRole('img', { name: 'Anna Petrova' });
    expect(avatar).toHaveTextContent('AP');
  });

  it('uses two letters of a single name and the same colour for the same name', () => {
    const { container } = render(
      <>
        <Avatar name="Ivan" />
        <Avatar name="Ivan" />
      </>,
    );
    const [a, b] = container.querySelectorAll('.vui-avatar');
    expect(a).toHaveTextContent('IV');
    expect((a as HTMLElement).style.background).toBe((b as HTMLElement).style.background);
  });

  it('renders the photo instead of initials', () => {
    const { container } = render(<Avatar name="Anna" src="/a.jpg" />);
    expect(container.querySelector('img')).toHaveAttribute('src', '/a.jpg');
  });

  it('collapses the overflow into +N', () => {
    render(
      <AvatarGroup aria-label="Room" max={2}>
        <Avatar name="A" />
        <Avatar name="B" />
        <Avatar name="C" />
        <Avatar name="D" />
      </AvatarGroup>,
    );
    expect(screen.getByRole('group', { name: 'Room' })).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(screen.getByLabelText('+2')).toHaveTextContent('+2');
  });
});
