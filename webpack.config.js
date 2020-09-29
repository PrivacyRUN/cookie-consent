var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/app.ts',
	target: 'web',
	// devtool: 'inline-source-map',
	mode: 'production',
	//mode: 'development',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'cookieconsent.js'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				use: 'ts-loader',
				test: /\.ts?$/
			}
		]
	}
}