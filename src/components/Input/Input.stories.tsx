import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ArrowRightIcon, CloseIcon, EyeIcon, EyeOffIcon, SearchIcon } from '../../icons';
import { Input } from './Input';
import { InputButton } from './InputButton';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          'Текстовое поле. Иконки ставятся через `startIcon` и `endIcon`, кнопка внутри поля — через `action` и `InputButton`. Все нативные пропсы и `ref` уходят на `<input>`.',
      },
    },
  },
  args: {
    placeholder: 'Your name',
    size: 'md',
    variant: 'filled',
  },
  argTypes: {
    startIcon: { control: false },
    endIcon: { control: false },
    action: { control: false },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const column = { display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 } as const;

export const Playground: Story = {};

export const Basic: Story = {
  render: () => (
    <div style={column}>
      <Input block label="Name" placeholder="Your name" hint="Shown on your profile" />
      <Input block label="Email" placeholder="you@example.com" variant="outlined" />
      <Input block label="Phone" defaultValue="+7 999" error="Enter the full number" />
      <Input block label="Disabled" placeholder="Not available" disabled />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div style={column}>
      <Input block type="search" placeholder="Search" startIcon={<SearchIcon />} />
      <Input
        block
        type="search"
        placeholder="Search"
        startIcon={<SearchIcon />}
        variant="outlined"
      />
      <Input block placeholder="Amount" endIcon={<span style={{ fontSize: 17 }}>₽</span>} />
    </div>
  ),
};

function PasswordInput() {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      block
      label="Password"
      type={visible ? 'text' : 'password'}
      defaultValue="secret-password"
      action={
        <InputButton
          variant="ghost"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </InputButton>
      }
    />
  );
}

function ClearableSearch() {
  const [value, setValue] = useState('Summer playlist');
  return (
    <Input
      block
      type="search"
      placeholder="Search"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      startIcon={<SearchIcon />}
      action={
        value && (
          <InputButton variant="ghost" aria-label="Clear" onClick={() => setValue('')}>
            <CloseIcon />
          </InputButton>
        )
      }
    />
  );
}

export const WithButton: Story = {
  render: () => (
    <div style={column}>
      <Input block placeholder="Promo code" action={<InputButton>Apply</InputButton>} />
      <Input
        block
        type="email"
        placeholder="Email for the newsletter"
        variant="outlined"
        action={
          <InputButton aria-label="Subscribe">
            <ArrowRightIcon />
          </InputButton>
        }
      />
      <PasswordInput />
      <ClearableSearch />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={column}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Input
          key={size}
          block
          size={size}
          placeholder={`Size ${size}`}
          startIcon={<SearchIcon />}
          action={<InputButton>Find</InputButton>}
        />
      ))}
    </div>
  ),
};
