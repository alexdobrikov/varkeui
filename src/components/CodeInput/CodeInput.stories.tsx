import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { CodeInput } from './CodeInput';

const meta = {
  title: 'Components/CodeInput',
  component: CodeInput,
  args: { length: 6, 'aria-label': 'Verification code', size: 'md' },
} satisfies Meta<typeof CodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <CodeInput aria-label="Four digits" length={4} defaultValue="27" />
      <CodeInput aria-label="Six digits" defaultValue="482913" />
      <CodeInput aria-label="Invalid" defaultValue="111111" invalid />
      <CodeInput aria-label="Masked" length={4} defaultValue="1234" mask size="lg" />
      <CodeInput aria-label="Letters" mode="text" length={5} defaultValue="AB7" />
      <CodeInput aria-label="Disabled" length={4} disabled />
    </div>
  ),
};

function VerifyDemo() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'wrong' | 'ok'>('idle');

  const check = (value: string) => {
    setStatus('checking');
    setTimeout(() => setStatus(value === '123456' ? 'ok' : 'wrong'), 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
      <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--vui-color-text)' }}>
        Enter the code
      </div>
      <div style={{ color: 'var(--vui-color-text-muted)', fontSize: 15 }}>
        Sent to you@example.com — try 123456
      </div>
      <CodeInput
        aria-label="Verification code"
        value={code}
        onValueChange={(value) => {
          setCode(value);
          if (status === 'wrong') setStatus('idle');
        }}
        onComplete={check}
        invalid={status === 'wrong'}
        autoFocus
      />
      <div
        style={{
          minHeight: 20,
          fontSize: 14,
          color: status === 'wrong' ? 'var(--vui-color-danger)' : 'var(--vui-color-text-muted)',
        }}
      >
        {status === 'checking' && 'Checking…'}
        {status === 'wrong' && 'Wrong code, try again'}
        {status === 'ok' && 'Done! You are signed in'}
      </div>
      <Button variant="ghost" size="sm" style={{ alignSelf: 'flex-start' }}>
        Send a new code
      </Button>
    </div>
  );
}

export const Verification: Story = {
  render: () => <VerifyDemo />,
};
