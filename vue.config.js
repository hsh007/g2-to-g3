const CompressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = {
	// publicPath: process.env.NODE_ENV === 'production' ? '/vant-demo/' : '/',
	css: {
		extract: false
	},
	configureWebpack:config=>{
			config.plugins.push(
				new CompressionWebpackPlugin({
					test:/\.js$|\.html$|\.css$/,
					threshold:4096
				})
			)
	}
};
