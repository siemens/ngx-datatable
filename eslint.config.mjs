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
      'off',
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
    '@typescript-eslint/naming-convention': ['off'],
    '@typescript-eslint/no-this-alias': ['off'],
    '@angular-eslint/no-input-rename': ['off'],
    '@angular-eslint/no-output-native': ['off'],
    '@angular-eslint/directive-class-suffix': ['off'],
    '@angular-eslint/no-conflicting-lifecycle': ['off'],
    'prefer-arrow/prefer-arrow-functions': ['off'],
    'prefer-rest-params': ['off']
  }
});

export const templateConfig = typescriptEslint.config({
  extends: [...angularTemplateConfig],
  files: ['**/*.html'],
  rules: {
    '@angular-eslint/template/prefer-ngsrc': ['off'],
    '@angular-eslint/template/no-inline-styles': ['off'],
    '@angular-eslint/template/interactive-supports-focus': ['off'],
    '@angular-eslint/template/prefer-self-closing-tags': ['off'],
    '@angular-eslint/template/attributes-order': ['off'],
    '@angular-eslint/template/no-interpolation-in-attributes': ['off'],
    '@angular-eslint/template/prefer-static-string-properties': ['off'],
    '@angular-eslint/template/button-has-type': ['off'],
    '@angular-eslint/template/no-positive-tabindex': ['off'],
    '@angular-eslint/template/elements-content': [
      'off',
      {
        allowList: ['aria-label', 'innerHtml', 'innerHTML', 'innerText', 'outerHTML', 'title']
      }
    ]
  }
});

export default typescriptEslint.config(...tsConfig, ...templateConfig);
