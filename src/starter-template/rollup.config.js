import { string } from 'rollup-plugin-string';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

export default {
	input: './index.js',
	output: {
		file: './bundle.js',
		format: 'cjs'
	},
	plugins: [
		commonjs(),
		string( {
			// Required to be specified
			include: '**/*.(mustache|less|css)'
		} ),
		nodeResolve(),
		json()
	]
};
