import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const noLegacyImports = {
  "no-restricted-imports": [
    "error",
    {
      patterns: [
        {
          group: ["@/lib/*", "@/components/*", "@/contexts/*", "@/hooks/*"],
          message:
            "Gunakan lokasi target: @/shared/lib, @/shared/components, atau barrel fitur.",
        },
      ],
    },
  ],
};

const noFeatureInternals = {
  "no-restricted-imports": [
    "error",
    {
      patterns: [
        {
          group: [
            "@/app/*",
            "@/features/*/api/*",
            "@/features/*/actions/*",
            "@/features/*/components/*",
            "@/features/*/hooks/*",
            "@/features/*/pages/*",
            "@/features/*/types/*",
            "@/features/*/lib/*",
          ],
          message:
            "Impor fitur lain hanya lewat barrel @/features/<fitur>.",
        },
      ],
    },
  ],
};

const noSharedToFeatures = {
  "no-restricted-imports": [
    "error",
    {
      patterns: [
        {
          group: ["@/features/*", "@/app/*"],
          message:
            "shared/ tidak boleh bergantung pada features/ atau app/.",
        },
      ],
    },
  ],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: noLegacyImports,
  },
  {
    files: ["src/app/**/*.{ts,tsx}"],
    ignores: ["src/app/api/**"],
    rules: noFeatureInternals,
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: noFeatureInternals,
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: noSharedToFeatures,
  },
]);

export default eslintConfig;
