import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRightIcon } from '../../icons';
import { ShineButton } from './ShineButton';

const meta = {
  title: 'Components/ShineButton',
  component: ShineButton,
  args: {
    children: 'Войти',
    size: 'md',
  },
  argTypes: {
    color: { control: 'color' },
    textColor: { control: 'color' },
    shineColor: { control: 'color' },
    startIcon: { control: false },
    endIcon: { control: false },
    as: { control: false },
  },
} satisfies Meta<typeof ShineButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' } as const;

export const Playground: Story = {};

export const Colors: Story = {
  render: () => (
    <div style={row}>
      <ShineButton>Цвет варианта</ShineButton>
      <ShineButton color="#e8b04a" textColor="#1c1b20">
        Золотая
      </ShineButton>
      <ShineButton color="#2aabee">Как в Telegram</ShineButton>
      <ShineButton color="#1c1b20" shineColor="rgb(232 176 74 / 0.7)">
        Тёмная с золотым бликом
      </ShineButton>
    </div>
  ),
};

/** На ярком фоне серую кнопку не видно, а такую — сразу. */
export const OnBrightBackground: Story = {
  render: () => (
    <div style={{ ...row, padding: 24, borderRadius: 24, background: '#d40000' }}>
      <ShineButton variant="secondary">Обычная</ShineButton>
      <ShineButton color="#e8b04a" textColor="#1c1b20" endIcon={<ArrowRightIcon />}>
        Войти
      </ShineButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      <ShineButton size="sm" color="#e8b04a" textColor="#1c1b20">
        Small
      </ShineButton>
      <ShineButton size="md" color="#e8b04a" textColor="#1c1b20">
        Medium
      </ShineButton>
      <ShineButton size="lg" color="#e8b04a" textColor="#1c1b20">
        Large
      </ShineButton>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, color: '#e8b04a', textColor: '#1c1b20' },
};
