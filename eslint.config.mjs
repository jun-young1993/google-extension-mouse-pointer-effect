import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  prettierConfig, // Prettier와 충돌하는 규칙 비활성화
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'linebreak-style': 'off',
      'react/react-in-jsx-scope': 'off', // React 17+에서는 필요 없음
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
      'padding-line-between-statements': [
        //함수 사이에 빈줄
        'warn',
        { blankLine: 'always', prev: 'function', next: 'function' },
      ],
    },
  },
  {
    settings: {
      react: {
        // 현재 React 버전을 명시합니다.
        // 명시하지 않을 경우(기본값 'detect') React 라이브러리 전체를 불러오므로
        // 린트 과정에서 속도가 느려질 수 있습니다.
        // 예: '16.9', '17.0', '18.0' 등
        version: '18.3',
      },
    },
  },
];
