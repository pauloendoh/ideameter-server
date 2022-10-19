import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "build/**/*"],
    watchExclude: [...configDefaults.watchExclude, "build/**/*"],

    // PE 1/3 - find some way to use .env.test
    env: {
      DATABASE_URL: "postgresql://prisma:prisma@localhost:5433/tests",
    },
  },
})
