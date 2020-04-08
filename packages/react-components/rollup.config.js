import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import localResolve from 'rollup-plugin-local-resolve';
import external from "rollup-plugin-peer-deps-external";
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';
// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'; // set globals that are required

const GLOBALS = {
	react: 'React',
	'react-dom': 'ReactDOM',
};

const env = process.env.NODE_ENV;

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.js',
		output: {
			file: pkg.browser,
			format: 'umd',
			name: 'gbifReactComponents',
			globals: GLOBALS,
		},
		external: [
			'react',
			'react-dom'
		],
		plugins: [
			resolve({
				// browser: true
				preferBuiltins: true, 
				mainFields: ['browser']
			}), // so Rollup can find `dependencies`
			babel({
				exclude: 'node_modules/**',
				plugins: [
					['transform-react-remove-prop-types', { removeImport: true }], 
					'@babel/plugin-transform-runtime'],
				runtimeHelpers: true
			}),
			commonjs({
				// extensions: ['.esm.js', '.mjs', '.js', '.ts'],
				include: 'node_modules/**',
				// 	namedExports: {
				// 	"body-scroll-lock": ["enableBodyScroll", "disableBodyScroll"]
				// }
			}),
			// commonjs({
			// 	include: "node_modules/**",
			// 	// namedExports: {
			// 	// 	"body-scroll-lock": ["enableBodyScroll", "disableBodyScroll"]
			// 	// }
			// }), // so Rollup can convert `packages` to ES modules
			external({
				// includeDependencies: true,
			}),
			localResolve(),
			
			replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
			env === 'production' && terser(),
			filesize(),
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/index.js',
		external: [
			'react',
			'react-dom',
			'prop-types'
		],
		plugins: [
			external({
				includeDependencies: true,
			}),
			babel({
				exclude: 'node_modules/**',
				plugins: ['transform-react-remove-prop-types', '@babel/plugin-transform-runtime'],
				runtimeHelpers: true,
			}),
			localResolve(),
			resolve(), // so Rollup can find `dependencies`
			commonjs({
				include: "node_modules/**",
				// namedExports: {
				// 	"body-scroll-lock": ["enableBodyScroll", "disableBodyScroll"]
				// }
			}), // so Rollup can convert `packages` to ES modules
			replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];