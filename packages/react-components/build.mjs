import { analyzeMetafile, build } from 'esbuild';
import fsp from 'fs/promises';
import GlobalsPlugin from 'esbuild-plugin-globals';

const shared = {
  bundle: true,
  logLevel: "info",
  target: ['esnext'],
  external: ['react', 'react-dom'],
  minify: true,
  sourcemap: true,
	loader: {
		'.js': 'jsx'
	},
  jsx: 'automatic',
  jsxImportSource: '@emotion/react',
};

const configs = [
  {
    format: 'esm',
    entryPoints: ['src/index.js'],
    outfile: `./dist/index.esm.js`,
    metafile: true,
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
        'react': 'window.React',
        'react-dom': 'window.ReactDOM',
      })
    ]
  }
  // {
  //   format: 'esm',
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
  //   external: ['react', 'react-dom'],
  //   outdir: './dist/esm',
  // },
]

configs.forEach(async (configPart) => {
  const result = await build({
    ...shared,
    ...configPart
  })
  if (configPart.format === 'esm') {
    await fsp.writeFile(
      './analysis.txt',
      await analyzeMetafile(result.metafile, {
        verbose: true
      })
    );
    await fsp.writeFile(
      './metafile.json',
      JSON.stringify(result.metafile, null, 2)
    );
  }
});

