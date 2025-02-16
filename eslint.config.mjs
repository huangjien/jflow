import pluginNext from "@next/eslint-plugin-next";
import parser from "@typescript-eslint/parser";
import globals from "globals";
import js from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    name: "ESLint Config - nextjs",
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",

        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    ...js.configs.recommended,
    plugins: {
      "@next/next": pluginNext,
      prettier: prettier,
    },
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["dist", "build", ".next", "node_modules"],
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
      ...prettierConfig.rules,
      "prettier/prettier": "warn",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
      "no-unused-vars": 0,
      "@typescript-eslint/no-explicit-any": ["off"],
      "explicit-module-boundary-types": 0,
      "no-non-null-assertion": 0,
      "no-non-null-asserted-optional-chain": 0,
    },
  },
];
