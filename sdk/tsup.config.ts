import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/"],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ["esm", "cjs"],
  minify: true,
  outDir: "lib",
  dts: true,
});
