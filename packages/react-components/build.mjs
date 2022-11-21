import { analyzeMetafile, build } from 'esbuild';
import fsp from 'fs/promises';

const entry = "src/index.js";
const shared = {
  bundle: true,
  entryPoints: [entry],
  mainFields: ['browser', 'module', 'main'],
  external: ['react', 'react-dom'],
  logLevel: "info",
  minify: true,
  sourcemap: true,
	loader: {
		'.js': 'jsx'
	},
  jsx: 'automatic',
  jsxImportSource: '@emotion/react'
};

['esm', 'cjs'].forEach(async (format) => {
  const result = await build({
    ...shared,
    format,
    outfile: `./dist/index.${format}.js`,
    metafile: format === 'esm'
  })
  // if (format === 'esm') {
  //   await fsp.writeFile(
  //     './analysis.txt',
  //     await analyzeMetafile(result.metafile, {
  //       verbose: true
  //     })
  //   );
  //   await fsp.writeFile(
  //     './metafile.json',
  //     JSON.stringify(result.metafile, null, 2)
  //   );
  // }
});

