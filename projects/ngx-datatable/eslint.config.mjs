import { defineConfig } from 'eslint/config';
import defaultValuePlugin from '@siemens/eslint-plugin-defaultvalue';

import { tsConfig, templateConfig } from '../../eslint.config.mjs';

export default defineConfig(
  {
    extends: [...tsConfig],
    plugins: {
      defaultValue: defaultValuePlugin
    },
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: [
          'projects/ngx-datatable/tsconfig.lib.json',
          'projects/ngx-datatable/tsconfig.spec.json'
        ]
      }
    }
  },
  ...templateConfig
);
