const { PluginInlineWorker } = require('./plugins/line-webworker')

require('esbuild').build({
  absWorkingDir: __dirname,
  entryPoints: ['packages/main.ts'],
  outfile: 'build/index.js',
  external: ['http', 'https', 'zlib'],
  format: 'esm',
  watch: false,
  bundle: true,
  minify: false,
  plugins: [PluginInlineWorker({
    minify: false,
    external: ['http', 'https', 'zlib']
  })]
}).then(() => console.log('⚡ Done'))
  .catch(() => process.exit(1))
