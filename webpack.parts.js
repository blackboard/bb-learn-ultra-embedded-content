/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.devServer = options => ({
    devServer: {
        historyApiFallback: {
            index: `${options.urlBase}/index.html`,
        },
        hot: true,
        https: false,
        stats: 'errors-only',
        host: options.host,
        port: options.port,
        publicPath: options.publicPath,
        disableHostCheck: options.disableHostCheck,
        public: options.public || undefined,
        proxy: options.proxy || undefined
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
});

exports.processReact = (paths, withHotLoader) => ({
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: paths,
                use: (withHotLoader) ? ['react-hot-loader', 'babel-loader'] : ['babel-loader'],
            },
        ],
    },
});

exports.lintJavaScript = ({ paths, options }) => ({
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                include: paths,
                options,
            },
        ],
    },
});

exports.loadCSS = paths => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                include: paths,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                        'postcss-loader',
                    ],
                }),
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
    ],
});

exports.loadSASS = paths => ({
    module: {
        rules: [
            {
                test: /\.scss$/,
                include: paths,
                use: ['style-loader?sourceMap', 'css-loader?sourceMap', 'sass-loader?sourceMap'],
            },
        ],
    },
});

exports.loadSvg = paths => ({
    module: {
        rules: [
            {
                test: /\.svg$/,
                include: paths,
                oneOf: [
                    {
                        issuer: /\.scss$/,
                        use: 'svg-url-loader',
                    },
                    {
                        use: 'svg-inline-loader',
                    },
                ],
            },
        ],
    },
});

exports.clean = (path, excludesArray) => ({
    plugins: [
        new CleanWebpackPlugin([path], {
            exclude: excludesArray,
        }),
    ],
});

exports.generateSourcemaps = type => ({
    devtool: type,
});

exports.minifyJavaScript = ({ useSourceMap }) => ({
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: useSourceMap,
            compress: {
                warnings: false,
            },
        }),
    ],
});

exports.setFreeVariable = (key, value) => {
    const env = {};
    env[key] = JSON.stringify(value);
    return {
        plugins: [
            new webpack.DefinePlugin(env),
        ],
    };
};
