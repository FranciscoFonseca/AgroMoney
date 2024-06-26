module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'react'],
	rules: {
		'react/jsx-key': 'off', // Ignore the 'react/jsx-key' warning
		'react/react-in-jsx-scope': 'off', // Ignore the 'react/react-in-jsx-scope' warning
		'react/prop-types': 'off', // Ignore the 'react/prop-types' warning
		//'react/display-name': 'off', // Ignore the 'react/display-name' warning
		'react/no-unescaped-entities': 'warn', // Ignore the 'react/no-unescaped-entities' warning
		'no-prototype-builtins': 'off', // Ignore the 'no-prototype-builtins' warning
		'no-mixed-spaces-and-tabs': 'off', // Ignore the 'no-mixed-spaces-and-tabs' warning
		'@typescript-eslint/no-unused-vars': 'off', // Ignore the '@typescript-eslint/no-unused-vars' warning
		'@typescript-eslint/no-explicit-any': 'off', // Ignore the '@typescript-eslint/no-explicit-any' warning
		'@typescript-eslint/ban-ts-comment': 'off', // Ignore the '@typescript-eslint/ban-ts-comment' warning
		'prefer-const': 'off',
	},
};
