import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import localResolve from 'rollup-plugin-local-resolve';
import external from "rollup-plugin-peer-deps-external";
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import pkg from './package.json';
// eslint-disable-next-line no-unused-vars
// import regeneratorRuntime from 'regenerator-runtime'; // set globals that are required

const env = process.env.NODE_ENV;

// export default [
// 	// CommonJS (for Node) and ES module (for bundlers) build.
// 	{
// 		input: 'src/index.js',
// 		// external: [
// 		// 	'react',
// 		// 	'react-dom',
// 		// 	'prop-types'
// 		// ],
// 		plugins: [
// 			external({
// 				includeDependencies: true,
// 			}),
// 			babel({
// 				babelHelpers: 'bundled',
// 				exclude: 'node_modules/**',
// 				plugins: ['transform-react-remove-prop-types', '@babel/plugin-transform-runtime'],
// 				// runtimeHelpers: true,
// 			}),
// 			localResolve(),
// 			resolve(), // so Rollup can find `dependencies`
// 			commonjs({
// 				include: "node_modules/**",
// 			}), // so Rollup can convert `packages` to ES modules
// 			replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
// 		],
// output: [
// 	{ file: pkg.main, format: 'cjs' },
// 	{ file: pkg.module, format: 'es' }
// ]
// 	}
// ];

export default [
	{
		input: 'src/components/Input/Input.js',
		plugins: [
			external({
				includeDependencies: true,
			}),
			babel({
				babelHelpers: 'runtime',
				exclude: 'node_modules/**',
				plugins: ['transform-react-remove-prop-types', '@babel/plugin-transform-runtime'],
			}),
			resolve({exportConditions: ['node']}),
			commonjs(),
      json(),
			replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
		],
		// external: ['react', '@babel/runtime'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
    // output: {
    //   file: pkg.main,
    //   format: 'cjs'
    // }

		// output: [
		//   {
		//     file: 'dist/index.cjs.js',
		//     format: 'cjs',
		//     name: 'MyLib',
		//     exports: 'named',
		//     globals: { react: 'React' }
		//   }
		// ]
	}
]