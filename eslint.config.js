import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import tsParser from "@typescript-eslint/parser";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";

export default tseslint.config(
  { ignores: ["dist", "node_modules/", "server/test/", "server/dist/"] },
  // Server files: use server/tsconfig.json, Node.js env
  {
    files: ["server/**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 2021,
      globals: globals.node,
      parser: tsParser,
      parserOptions: {
        project: "./server/tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      "no-console": "warn",
      // NestJS doesn't require explicit public/private on every method
      "@typescript-eslint/explicit-member-accessibility": "off",
      // NestJS services often delegate without this
      "class-methods-use-this": "off",
      // Member ordering: class properties can be anywhere
      "@typescript-eslint/member-ordering": "off",
      "unicorn/better-regex": "error",
      "unicorn/no-document-cookie": "off",
      "unicorn/no-null": "off",
    },
  },
  // Frontend files: use root tsconfig.json, browser env, React rules
  {
    extends: [
      js.configs.recommended,
      eslintPluginUnicorn.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
    ],
    linterOptions: {
      reportUnusedDisableDirectives: "error",
      noInlineConfig: false,
    },
    files: ["src/**/*.{ts,tsx}", "vite.config.ts"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": tsEslintPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],

      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { accessibility: "explicit", overrides: { constructors: "off" } },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      "@typescript-eslint/member-ordering": "error",
      "class-methods-use-this": "error",
      "unicorn/better-regex": "error",
      "no-console": "warn",
      "unicorn/no-document-cookie": "off",
      "unicorn/no-null": "off",
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".tsx", ".ts", ".d.ts"],
        },
        alias: {
          extensions: [".tsx", ".js", ".ts", ".scss", ".css", ".d.ts"],
          map: ["@/shared", "src/shared"],
        },
      },
    },
  },
);
