import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "*my_doctor_backend*",
                "*my-doctor-admin-panel*",
                "*my_doctor_mobile*",
                "**/*my_doctor_backend*",
                "**/*my-doctor-admin-panel*",
                "**/*my_doctor_mobile*",
              ],
              message:
                "Strict isolation enforced: Cannot import from other repositories.",
            },
          ],
        },
      ],
    },
  },
]);
