import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['dist/esm/index.js'],
  outfile: 'dist/cjs/index.cjs',
  format: 'cjs',
  platform: 'node',
  target: ['node12'],
  bundle: true,
});
