import vitest from '@vitest/eslint-plugin';
import love from 'eslint-config-love';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';
import ts from 'typescript-eslint';

export default ts.config(
    {
        ignores: ['dist**/*', 'report**/*', 'src/ajv-formats', 'src/ajv-formats-draft2019'],
    },
    {
        files: ['**/*.ts', '**/*.js', '**/*.mjs'],
    },
    love,
    unicorn.configs['flat/recommended'],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    sonarjs.configs.recommended,
    vitest.configs.recommended,
    {
        plugins: {
            'unused-imports': unusedImports,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            // simple-import-sort
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            // unused-imports
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        rules: {
            // Custom Rules (eslint)
            'no-implicit-coercion': 'error',
            'prefer-template': 'error',
            'arrow-body-style': 'error',
            'object-shorthand': 'error',
            // Custom Rules (typescript-eslint)
            '@typescript-eslint/switch-exhaustiveness-check': 'error',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-magic-numbers': 'off',
            '@typescript-eslint/prefer-destructuring': 'off',
            'sonarjs/deprecation': 'off',
        },
    },
    prettier,
);
