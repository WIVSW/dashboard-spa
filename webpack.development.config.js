const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
	entry: {
		index:'./src/ui/index.js',
		vendor: ['react', 'react-dom']
	},
	output: {
		path: path.resolve(__dirname, 'src/public'),
		filename: "js/[name].[hash].js",
		publicPath: '/',
	},
	optimization: {
		minimize: false,
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
	devServer: {
		host: '192.168.0.103', // Defaults to `localhost`
		port: 9000, // Defaults to 8080
		historyApiFallback: true,
		proxy: {
			'/api': {
				target: 'http://localhost:3000/',
				secure: false
			}
		}
	},
	plugins: [
		new ExtractTextPlugin("css/index.[hash].css"),
		new HtmlWebpackPlugin({
			template: 'src/ui/index.html'
		}),
		new webpack.HotModuleReplacementPlugin()
	]
};