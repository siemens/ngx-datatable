import { defineConfig } from 'eslint/config';

import { tsConfig } from '../../eslint.config.mjs';

export default defineConfig({
  extends: [...tsConfig],
  files: ['**/*.mts'],
  languageOptions: {
    parserOptions: {
      project: ['tools/example-routes-builder/tsconfig.json']
    }
  }
});
