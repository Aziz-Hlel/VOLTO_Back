// // @ts-check
// import eslint from '@eslint/js';
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';

// export default tseslint.config(
//   {
//     ignores: ['eslint.config.mjs'],
//   },
//   eslint.configs.recommended,
//   ...tseslint.configs.recommendedTypeChecked,
//   eslintPluginPrettierRecommended,
//   {
//     languageOptions: {
//       globals: {
//         ...globals.node,
//         ...globals.jest,
//       },
//       sourceType: 'commonjs',
//       parserOptions: {
//         projectService: true,
//         tsconfigRootDir: import.meta.dirname,
//       },
//     },
//   },
//   {
//     rules: {
//       '@typescript-eslint/no-explicit-any': 'off', // you can relax this
//       '@typescript-eslint/no-floating-promises': 'warn', // keep warnings
//       '@typescript-eslint/no-unsafe-argument': 'off', // optional for now
//       '@typescript-eslint/no-unused-vars': [
//         'warn',
//         { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
//       ], // highlight unused variables
//       // 'prettier/prettier': [
//       //   'error',
//       //   { singleQuote: true, trailingComma: 'all' },
//       // ], // make prettier rules errors

//       'prettier/prettier': 'off',
//     },
//   },
// );
