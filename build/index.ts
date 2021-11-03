import esbuild from 'esbuild'
import { $ } from 'zx'

const isDevelop = process.env.NODE_ENV === 'develop'

void (async () => {
  await $`rm -rf dist`
  await esbuild
    .build({
      entryPoints: ['src/index.ts'],
      outdir: 'dist',
      target: 'esnext',
      format: 'esm',
      bundle: true,
      watch: isDevelop,
      sourcemap: isDevelop,
      minify: !isDevelop
    })
    .then(async (res) => {
      isDevelop ? await $`tsc --watch` : await $`tsc`
    })
})().catch(() => process.exit(1))
