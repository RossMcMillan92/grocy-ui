module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    // 'eslint:recommended',
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:tailwind/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: [
    "sort-imports-es6-autofix",
    "@typescript-eslint",
    "react-hooks",
    "prettier",
  ],
  rules: {
    semi: 0,
    "no-console": "error",
    "prefer-template": "error",
    "react/display-name": 0,
    "react/prop-types": 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "sort-imports-es6-autofix/sort-imports-es6": [
      2,
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
