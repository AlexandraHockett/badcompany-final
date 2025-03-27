import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend recommended configurations
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ),
  // Add JSX accessibility plugin
  {
    plugins: {
      "jsx-a11y": eslintPluginJsxA11y,
    },
  },
  // Custom rules
  {
    rules: {
      // Existing rules from your config
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "off",
      "prefer-const": "warn",
      "@next/next/no-img-element": "warn",
      "react/display-name": "off",
      // Address specific errors
      "@typescript-eslint/no-namespace": "off", // Allow namespaces (for prisma.ts)
      "jsx-a11y/alt-text": [
        "error",
        {
          elements: ["img"], // Apply only to <img> elements
          exclude: ["Image"], // Exclude Lucide's <Image> component
        },
      ],
    },
  },
];

export default eslintConfig;
