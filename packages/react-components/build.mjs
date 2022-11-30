import { analyzeMetafile, build } from 'esbuild';
import fsp from 'fs/promises';
import GlobalsPlugin from 'esbuild-plugin-globals';

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
    outfile: `./dist/index.esm.js`,
    metafile: OUTPUT_META,
  },
  {
    format: 'cjs',
    entryPoints: ['src/index.js'],
    outfile: `./dist/index.cjs.js`,
  },
  {
    format: 'iife',
    globalName: 'gbifReactComponents',
    entryPoints: ['src/index.js'],
    outfile: `./dist/index.iife.js`,
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
