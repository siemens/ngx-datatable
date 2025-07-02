import path from 'path';
import { fileURLToPath } from 'url';
import typescriptEslint from 'typescript-eslint';
import angularTypescriptConfig from '@siemens/eslint-config-angular';
import angularTemplateConfig from '@siemens/eslint-config-angular/template';
import eslintPluginHeaders from 'eslint-plugin-headers';

// mimic CommonJS variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const tsConfig = typescriptEslint.config({
  extends: [...angularTypescriptConfig],
  files: ['**/*.ts'],
  languageOptions: {
    parserOptions: {
      project: ['tsconfig.json'],
      tsconfigRootDir: __dirname
    }
  },
  plugins: {
    'headers': eslintPluginHeaders
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['off'],
    '@angular-eslint/prefer-signals': [
      'error',
      {
        preferInputSignals: false,
        preferQuerySignals: false
      }
    ],
    'no-console': [
      'error',
      {
        allow: ['warn', 'error']
      }
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@angular/cdk/coercion',
            message: 'Use the convert functions from @angular/core instead.'
          }
        ]
      }
    ],
    '@typescript-eslint/no-deprecated': ['off'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'memberLike',
        format: ['camelCase'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'objectLiteralProperty',
        format: null
      }
    ],
    '@angular-eslint/no-input-rename': ['off'],
    '@angular-eslint/no-output-native': ['off'],
    '@angular-eslint/directive-class-suffix': ['off'],
    '@angular-eslint/no-conflicting-lifecycle': ['off'],
    '@angular-eslint/prefer-output-emitter-ref': ['off']
  }
});

export const templateConfig = typescriptEslint.config({
  extends: [...angularTemplateConfig],
  files: ['**/*.html'],
  rules: {
    '@angular-eslint/template/prefer-ngsrc': ['off'],
    '@angular-eslint/template/no-inline-styles': ['off'],
    '@angular-eslint/template/interactive-supports-focus': ['off'],
    '@angular-eslint/template/prefer-template-literal': ['off']
  }
});

export default typescriptEslint.config(...tsConfig, ...templateConfig);
