import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';
const meta = {
  title: 'Components/Select',
  component: Select,
  args: {
    label: 'Folder',
    children: (
      <>
        <option value="">No folder</option>
        <option value="hsk1">HSK 1</option>
        <option value="hsk2">HSK 2</option>
      </>
    ),
  },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Select {...args} key={size} size={size} label={size} />
      ))}
    </div>
  ),
};
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Disabled: Story = { args: { disabled: true } };
export const Error: Story = { args: { error: 'Choose a folder' } };
