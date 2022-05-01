module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 13,
		ecmaFeatures: {
			jsx: true
		},
		sourceType: "module"
	},
	settings: {
		"import/resolver": {
			typescript: {}
		},
		react: {
			version: "detect"
		}
	},
	extends: [
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:prettier/recommended"
	],
	plugins: ["prettier"],
	rules: {
		"prettier/prettier": "warn",
		"react/react-in-jsx-scope": "off"
	}
}
