import { build } from "esbuild";

await build({
  entryPoints: ["src/server.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  minify: true,
  outfile: "dist/bundle.js",
});
