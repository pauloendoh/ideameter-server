import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "build/**/*"],
    watchExclude: [...configDefaults.watchExclude, "build/**/*"],
    env: {
      DATABASE_URL: "postgresql://prisma:prisma@localhost:5433/tests",
    },
  },
})
