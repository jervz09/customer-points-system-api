export default [
	{
		files: ['**/*.js'],
		ignores: ['node_modules/**'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				console: 'readonly',
				process: 'readonly',
				__dirname: 'readonly',
				module: 'readonly',
				require: 'readonly',
			},
		},
		rules: {
			semi: ['error', 'always'],
			quotes: ['error', 'single'],
			'no-unused-vars': 'warn',
			'no-console': 'off',
		},
	},
];
