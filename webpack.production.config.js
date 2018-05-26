const path = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
	entry: './src/ui/index.js',
	output: {
		path: path.resolve(__dirname, 'src/public'),
		filename: "index.js"
	},
	module: {
		rules: [
			{
				use: 'babel-loader',
				test: /\.(js|jsx)$/
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{ loader: 'css-loader' },
						{
							loader: 'postcss-loader',
							options: {
								plugins: [
									autoprefixer({
										browsers:['ie >= 8', 'last 4 version']
									}),
									cssnano({
										discardComments: {
											removeAll: true
										}
									})

								]
							}
						},
						{ loader: 'sass-loader' }
					]
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin("index.[chunkhash].css"),
	]
};