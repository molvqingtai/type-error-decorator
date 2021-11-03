import esbuild from 'esbuild'

const isDevelop = process.env.NODE_ENV === 'develop'

esbuild
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
  .catch((error) => {
    console.error('error', error)
  })
