const path = require('path');
const webpack = require('webpack');
const version = require('./package.json').version;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js?[hash]'
    },
    module: {
        rules: [
            // {
            //     test: require.resolve('knockout'),
            //     use: [
            //         {
            //             loader: 'expose-loader',
            //             options: 'ko'
            //         }
            //     ]
            // },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
                browser: 'true'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        // new HtmlWebpackPlugin({
        //     template: './src/index.html',
        // }),
        new CopyWebpackPlugin([
            { from: './src/zip/inflate.js', to: './inflate.js' },
            { from: './src/zip/z-worker.js', to: './z-worker.js' },
        ]),
        new VersionWebpackPlugin()
    ]
};

// 打包后添加版本号
function VersionWebpackPlugin() {

}
VersionWebpackPlugin.prototype.apply = function (compiler) {
    compiler.plugin('emit', function (compilation, callback) {
        const assets = compilation.assets['index.js?' + compilation.hash];
        if (assets) {
            assets._value = `/* version: ${version}, author: ck */\n ${assets._value}`;
        }
        callback();
    });
};