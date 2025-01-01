import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

// Export our config array, which is composed together thanks to the typed utility function from typescript-eslint
export default tseslint.config(
  {
    // Everything in this config object targets our TypeScript files (Components, Directives, Pipes etc)
    files: ['**/*.ts'],
    extends: [
      // Apply the recommended core rules
      eslint.configs.recommended,
      // Apply the recommended TypeScript rules
      ...tseslint.configs.recommended,
      // Optionally apply stylistic rules from typescript-eslint that improve code consistency
      ...tseslint.configs.stylistic,
      // Apply the recommended Angular rules
      ...angular.configs.tsRecommended
    ],
    // Set the custom processor which will allow us to have our inline Component templates extracted
    // and treated as if they are HTML files (and therefore have the .html config below applied to them)
    processor: angular.processInlineTemplates,
    settings: {
      'import/ignore': ['node_modules']
    },
    // Override specific rules for TypeScript files (these will take priority over the extended configs above)
    rules: {
      'brace-style': 'off',
      'no-bitwise': 'off',
      'comma-dangle': 'off',
      'comma-spacing': 'off',
      'func-call-spacing': 'off',
      'indent': 'off',
      'keyword-spacing': 'off',
      'no-shadow': 'off',
      'no-duplicate-imports': 'error',
      'no-redeclare': 'off',
      'no-underscore-dangle': 'off',
      'array-bracket-spacing': 'error',
      'arrow-parens': ['error', 'as-needed'],
      'arrow-spacing': 'off',
      'curly': 'error',
      'key-spacing': 'off',
      'no-empty': 'error',
      'no-irregular-whitespace': 'error',
      'no-multi-spaces': 'error',
      'no-multiple-empty-lines': 'error',
      'object-curly-spacing': ['error', 'always'],
      'prefer-arrow/prefer-arrow-functions': 'off',
      'quote-props': ['error', 'consistent'],
      'semi-spacing': 'off',
      'space-in-parens': 'off',
      'space-infix-ops': 'off',
      'sort-imports': ['error', { 'ignoreCase': true, 'ignoreDeclarationSort': true }],
      'prefer-spread': 'off',
      'prefer-rest-params': 'off',

      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/brace-style': 'off',
      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/comma-spacing': 'off',
      '@typescript-eslint/func-call-spacing': 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/keyword-spacing': 'off',
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-shadow': ['error', { 'ignoreTypeValueShadow': true }],
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/no-this-alias': 'off',

      '@angular-eslint/no-attribute-decorator': 'error',
      '@angular-eslint/no-forward-ref': 'error',
      '@angular-eslint/use-component-view-encapsulation': 'error',
      '@angular-eslint/no-input-rename': 'off',
      '@angular-eslint/directive-class-suffix': 'off',
      '@angular-eslint/no-output-native': 'off'
    }
  },
  {
    // Everything in this config object targets our HTML files (external templates,
    // and inline templates as long as we have the `processor` set on our TypeScript config above)
    files: ['**/*.html'],
    extends: [
      // Apply the recommended Angular template rules
      ...angular.configs.templateRecommended,
      // Apply the Angular template rules which focus on accessibility of our apps
      ...angular.configs.templateAccessibility
    ],
    rules: {}
  }
);
