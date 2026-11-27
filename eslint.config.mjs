import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";

const compat = new FlatCompat({
  baseDirectory: fileURLToPath(new URL(".", import.meta.url)),
});
const config = [
  { ignores: [".next/**", "out/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { rules: { "@next/next/no-img-element": "off" } },
];

export default config;
