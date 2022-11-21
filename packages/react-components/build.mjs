import { analyzeMetafile, build } from 'esbuild';
import fsp from 'fs/promises';

const entry = "src/index.js";
// const shared = {
//   bundle: true,
//   entryPoints: [
//     'src/search/CollectionSearch/Standalone.js',
//     'src/search/DatasetSearch/Standalone.js',
//     'src/search/EventSearch/Standalone.js',
//     'src/search/InstitutionSearch/Standalone.js',
//     'src/search/LiteratureSearch/Standalone.js',
//     'src/search/OccurrenceSearch/Standalone.js',
//     'src/search/PublisherSearch/Standalone.js',
//     'src/entities/Collection/Standalone.js',
//     'src/entities/Institution/Standalone.js',
//     'src/entities/Dataset/Standalone.js',
//     'src/style/themeBuilder/index.js',
//   ],
//   mainFields: ['browser', 'module', 'main'],
//   external: ['react', 'react-dom'],
//   logLevel: "info",
//   // target: ['esnext'],
//   minify: true,
//   sourcemap: true,
// 	loader: {
// 		'.js': 'jsx'
// 	},
//   jsx: 'automatic',
//   jsxImportSource: '@emotion/react',
// };
const shared = {
  bundle: true,
  entryPoints: ['src/index.js'],
  mainFields: ['browser', 'module', 'main'],
  external: ['react', 'react-dom'],
  logLevel: "info",
  target: ['esnext'],
  minify: true,
  sourcemap: true,
	loader: {
		'.js': 'jsx'
	},
  jsx: 'automatic',
  jsxImportSource: '@emotion/react',
};

['esm', 'cjs'].forEach(async (format) => {
  const result = await build({
    ...shared,
    format,
    outfile: `./dist/index.${format}.js`,
    // outdir: `./dist/${format}`,
    metafile: format === 'esm',
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

