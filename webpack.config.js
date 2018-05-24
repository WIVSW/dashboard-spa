const path = require('path');



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
				test: /\.js$/
			}
		]
	}
};