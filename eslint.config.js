const js = require('@eslint/js');
const globals = require('globals');
const jsdoc = require('eslint-plugin-jsdoc');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
	{ ignores: ['lib/', 'node_modules/', 'coverage/'] },
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			// Command modules mix `import` with CommonJS `exports.*` for yargs commandDir.
			globals: { ...globals.node },
		},
		plugins: { jsdoc },
		rules: {
			'no-new': 1,
			'no-param-reassign': [2, { props: false }],
			'jsdoc/check-alignment': 1,
			'jsdoc/check-indentation': 1,
			'jsdoc/check-param-names': 1,
			'jsdoc/check-tag-names': 1,
			'jsdoc/check-types': 1,
			'jsdoc/no-undefined-types': 1,
			'jsdoc/require-description': 1,
			'jsdoc/require-param': [1, { enableFixer: false }],
			'jsdoc/require-param-description': 1,
			'jsdoc/require-param-name': 1,
			'jsdoc/require-param-type': 1,
			'jsdoc/require-returns': 1,
			'jsdoc/require-returns-check': 1,
			'jsdoc/require-returns-type': 1,
			'jsdoc/valid-types': 1,
		},
	},
	{
		files: ['test/**/*.js'],
		languageOptions: { globals: { ...globals.mocha } },
	},
	prettierRecommended,
	{
		rules: {
			// Same options @10up/eslint-config used, so formatting doesn't drift.
			'prettier/prettier': [
				2,
				{
					useTabs: true,
					tabWidth: 4,
					printWidth: 100,
					singleQuote: true,
					trailingComma: 'all',
					bracketSpacing: true,
					bracketSameLine: false,
					semi: true,
					arrowParens: 'always',
				},
				{ usePrettierrc: false },
			],
		},
	},
];
