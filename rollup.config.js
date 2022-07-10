import { defineConfig } from "rollup";
import metaBlock from "rollup-plugin-userscript-metablock";
import typescript from "@rollup/plugin-typescript";
import { readFileSync } from "fs";
import { env } from "process";

/** @type {import('./package.json')} */
const packageMeta = JSON.parse(readFileSync("./package.json", { encoding: "utf8" }));

// eslint-disable-next-line @cspell/spellchecker
/** @type {import("rollup-plugin-userscript-metablock").MetaValues & Record<string,string>} */
const userScriptMeta = {
  author: `${packageMeta.author.name} <${packageMeta.author.email}>`,
  version: env.BUILD_VERSION ?? "0.0.0-dev",
  description: packageMeta.description,
};

export default defineConfig({
  input: "src/index.ts",
  output: {
    file: "dist/hardverapro-preview.user.js",
    format: "cjs",
  },
  plugins: [
    metaBlock({
      file: "./src/meta.json",
      override: userScriptMeta,
    }),
    typescript(),
  ],
});
