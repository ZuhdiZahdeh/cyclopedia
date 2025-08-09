// eslint.config.js
import js from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    ignores: [
      "dist/**",
      "dist-ci/**",
      "dist-publish/**",
      "public/audio/**",
      "public/images/**",
      "public/**/*.min.js",
    ],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
