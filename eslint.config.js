import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default [
  { languageOptions: { ecmaVersion: 2023, globals: globals.node } },
  eslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  perfectionist.configs["recommended-natural"],
  { files: ["src/**/*.test.ts"], ...vitest.configs.recommended },
  {
    rules: {
      "unicorn/no-null": "off",
      "unicorn/prefer-spread": "off",
      "unicorn/prevent-abbreviations": ["error", { replacements: { arg: false, args: false, env: false } }],
    },
  },
];
