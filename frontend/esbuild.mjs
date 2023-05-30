import { build } from 'esbuild';

await build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  outfile: './build/out.js',
  minify: true,
  sourcemap: true,
  target: ['chrome58', 'firefox57', 'safari11', 'edge16']
});
