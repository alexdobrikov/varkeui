import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/styles/index.css';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'dark';
  // Порталы вроде Toaster рендерятся в body, поэтому тема нужна и на корне документа.
  document.documentElement.dataset.vuiTheme = theme;
  return (
    <div
      data-vui-theme={theme}
      style={{
        background: 'var(--vui-color-bg)',
        color: 'var(--vui-color-text)',
        padding: 32,
        minHeight: context.viewMode === 'docs' ? undefined : '100vh',
        boxSizing: 'border-box',
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Тема',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    options: {
      storySort: { order: ['Начало работы', 'Темы', 'Components', 'Examples'] },
    },
  },
};

export default preview;
