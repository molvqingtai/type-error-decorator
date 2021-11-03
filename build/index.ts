import esbuild from 'esbuild'
import { $ } from 'zx'

const development = process.env.NODE_ENV === 'development'

void (async () => {
  await $`rm -rf dist`
  await esbuild
    .build({
      entryPoints: ['src/index.ts'],
      outdir: 'dist',
      target: 'esnext',
      format: 'esm',
      bundle: true,
      watch: development,
      sourcemap: development,
      minify: !development
    })
    .then(async (res) => {
      development ? await $`tsc --watch` : await $`tsc`
    })
})().catch(() => process.exit(1))
