module.exports = {
	env: {
		browser: true,
		es2021: true,
		webextensions: true
	},
	ignorePatterns: ['.eslintrc.cjs', '*.scss'],
	extends: [
		'airbnb-typescript',
		'airbnb/hooks',
		'plugin:jsx-a11y/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 12,
		sourceType: 'module'
	},
	plugins: [
		'react',
		'jsx-a11y',
		'@typescript-eslint'
	],
	rules: {
		quotes: ['error', 'single'],
		indent: ['off'],
		'no-tabs': ['error', { allowIndentationTabs: true }],
		'react/jsx-indent-props': [2, 'tab'],
		'react/jsx-indent': [2, 'tab'],
		'comma-dangle': 'off',
		'@typescript-eslint/comma-dangle': ['error', 'never'],
		'no-console': ['error', { allow: ['warn', 'error'] }],
		'@typescript-eslint/indent': ['off'],
		'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }]
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx']
			}
		}
	}
};
