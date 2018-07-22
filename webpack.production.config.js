const path = require('path');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
	node: { fs: 'empty' },
	entry: {
		index:'./src/ui/index.js',
		vendor: ['react', 'react-dom']
	},
	output: {
		path: path.resolve(__dirname, 'src/public'),
		filename: "js/[name].[chunkhash].js"
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendor",
					chunks: "all"
				}
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: 'babel-loader',
				exclude: /node_modules/
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
			},
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: "url-loader" },
			{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: "url-loader" }
		]
	},
	plugins: [
		new CleanWebpackPlugin('src/public/*'),
		new ExtractTextPlugin("css/[name].[chunkhash].css"),
		new HtmlWebpackPlugin({
			template: 'src/ui/index.html'
		})
	]
};