import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Fact, FactList } from './FactList';

describe('FactList', () => {
  it('renders a definition list with label and value pairs', () => {
    const { container } = render(
      <FactList>
        <Fact icon={<svg data-testid="icon" />} label="Published">
          November 27
        </Fact>
      </FactList>,
    );
    expect(container.firstElementChild?.tagName).toBe('DL');
    expect(container.firstElementChild).toHaveClass('vui-facts', 'vui-facts--md');
    expect(screen.getByText('Published').tagName).toBe('DT');
    expect(screen.getByText('November 27').tagName).toBe('DD');
  });

  it('hides the decorative icon from screen readers', () => {
    render(
      <FactList>
        <Fact icon={<svg data-testid="icon" />} label="Level">
          Beginner
        </Fact>
      </FactList>,
    );
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('skips the icon slot when there is no icon', () => {
    const { container } = render(
      <FactList>
        <Fact label="Words">1 000</Fact>
      </FactList>,
    );
    expect(container.querySelector('.vui-fact__icon')).toBeNull();
  });

  it('applies the size modifier', () => {
    const { container } = render(
      <FactList size="lg">
        <Fact label="Words">1 000</Fact>
      </FactList>,
    );
    expect(container.firstElementChild).toHaveClass('vui-facts--lg');
  });
});
