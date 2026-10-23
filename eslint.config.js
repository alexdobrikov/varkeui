import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'storybook-static', 'node_modules', '!.storybook'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  ...storybook.configs['flat/recommended'],
  {
    files: ['scripts/**'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
);
