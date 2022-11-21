import { analyzeMetafile, build } from 'esbuild';
import fsp from 'fs/promises';

// const shared = {
//   bundle: true,
//   entryPoints: {
//     CollectionSearch: 'src/search/CollectionSearch/Standalone.js',
//     DatasetSearch: 'src/search/DatasetSearch/Standalone.js',
//     EventSearch: 'src/search/EventSearch/Standalone.js',
//     InstitutionSearch: 'src/search/InstitutionSearch/Standalone.js',
//     LiteratureSearch: 'src/search/LiteratureSearch/Standalone.js',
//     OccurrenceSearch: 'src/search/OccurrenceSearch/Standalone.js',
//     PublisherSearch: 'src/search/PublisherSearch/Standalone.js',
//     Collection: 'src/entities/Collection/Standalone.js',
//     Institution: 'src/entities/Institution/Standalone.js',
//     Dataset: 'src/entities/Dataset/Standalone.js',
//     themeBuilder: 'src/style/themeBuilder/index.js',
//   },
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

['esm'].forEach(async (format) => {
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

