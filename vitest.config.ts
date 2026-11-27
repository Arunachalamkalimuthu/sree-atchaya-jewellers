import { configDefaults, defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: {
    environment: "node",
    include: ["**/__tests__/**/*.test.ts?(x)"],
    // .claude/** holds agent worktrees (with their own node_modules) inside the repo.
    exclude: [...configDefaults.exclude, ".next/**", "out/**", ".claude/**"],
  },
});
