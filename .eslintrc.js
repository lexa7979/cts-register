module.exports = {
	// https://eslint.org/docs/user-guide/configuring#specifying-environments
    "env": {
        "browser": true,
		"es6": true,
		"node": true,
		"jest/globals": true,
	},
	// https://eslint.org/docs/user-guide/configuring#extending-configuration-files
	// "extends": "eslint:recommended",
	"extends": [
		"eslint:all",
		"plugin:react/recommended",
	],
	// https://eslint.org/docs/user-guide/configuring#specifying-globals
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
	},
	// https://eslint.org/docs/user-guide/configuring#specifying-parser-options
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
	},
	// https://eslint.org/docs/user-guide/configuring#configuring-plugins
    plugins: [
		"react",
		"jest",
	],
	// https://eslint.org/docs/user-guide/configuring#configuring-rules
    rules: {
		"object-curly-spacing": [ "error", "always" ],
		"space-in-parens": [ "error", "always" ],
		"quote-props": [ "error", "as-needed" ],
		indent: [ "error", "tab" ],
		"no-tabs": "off",
		"sort-imports": "off",
		"sort-keys": "off",
		"space-before-function-paren": [ "error", {
			anonymous: "always",
			named: "never",
			asyncArrow: "always"
		} ],
		"padded-blocks": [ "error", "never" ],
		"arrow-parens": [ "error", "as-needed" ],
		"max-len": [ "error", {
			code: 120,
			tabWidth: 4,
			ignoreComments: true,
		} ],
		"no-ternary": "off",
		"no-magic-numbers": "off",
		"array-element-newline": [ "error", "consistent" ],
		"object-property-newline": [ "error", {
			allowAllPropertiesOnSameLine: true,
		} ],
		"comma-dangle": [ "error", "always-multiline" ],
		"array-bracket-spacing": [ "error", "always" ],
		"prefer-destructuring": [
			"error",
			{
				VariableDeclarator: { array: false, object: true },
				AssignmentExpression: { array: false, object: true }
			},
			{ enforceForRenamedProperties: false }
		],
		"one-var": [ "error", {
			initialized: "never",
			uninitialized: "always"
		} ],
		"key-spacing": [ "error", {
			beforeColon: false,
			afterColon: true,
			mode: "minimum",
			align: "value",
		} ],
		"multiline-ternary": [ "error", "always-multiline" ],
		"multiline-comment-style": "off",
		"capitalized-comments": "off",
		"require-unicode-regexp": "off",
		"wrap-regex": "off",
		"require-jsdoc": [ "error", {
			require: {
				FunctionDeclaration: true,
				MethodDefinition: true,
				ClassDeclaration: true,
				ArrowFunctionExpression: true,
				FunctionExpression: true
			}
		} ],
		"max-statements": [ "warn", 20 ],
		"max-lines-per-function": [ "warn", 50 ],
		"func-style": [ "error", "declaration", { allowArrowFunctions: true } ],
		"no-multi-spaces": [ "error", {
			ignoreEOLComments: true,
			exceptions: {
				Property: true,
				VariableDeclarator: true,
				ImportDeclaration: true,
			}
		} ],
		"function-call-argument-newline": [ "error", "consistent" ],
		"no-inline-comments": "off",
		"line-comment-position": "off",
		"operator-linebreak": [ "error", "before" ],
		"brace-style": [ "error", "1tbs", { allowSingleLine: true } ],
	},
	// https://github.com/yannickcr/eslint-plugin-react#configuration
	settings: {
		react: {
			version: "detect"
		}
	}
};
