import { analyzeMetafile, build } from 'esbuild';
import GlobalsPlugin from 'esbuild-plugin-globals';
import fsp from 'fs/promises';

const OUTPUT_META = false;

const shared = {
  bundle: true,
  logLevel: 'info',
  target: ['esnext'],
  external: ['react', 'react-dom'],
  minify: true,
  sourcemap: true,
  loader: {
    '.js': 'jsx',
  },
  jsx: 'automatic',
  jsxImportSource: '@emotion/react',
};

const configs = [
  {
    format: 'esm',
    entryPoints: ['src/index.js'],
    outfile: `./dist/esm/index.mjs`,
    metafile: OUTPUT_META,
  },
  {
    format: 'cjs',
    entryPoints: ['src/index.js'],
    outfile: `./dist/cjs/index.cjs`,
  },
  {
    format: 'iife',
    globalName: 'gbifReactComponents',
    entryPoints: ['src/index.js'],
    outfile: `./dist/iife/index.js`,
    external: [],
    plugins: [
      GlobalsPlugin({
        react: 'window.React',
        'react-dom': 'window.ReactDOM',
      }),
    ],
  },
];

configs.forEach(async (configPart) => {
  const result = await build({
    ...shared,
    ...configPart,
  });
  if (OUTPUT_META && configPart.format === 'esm') {
    await fsp.writeFile(
      './analysis.txt',
      await analyzeMetafile(result.metafile, {
        verbose: true,
      })
    );
    await fsp.writeFile(
      './metafile.json',
      JSON.stringify(result.metafile, null, 2)
    );
  }
});
