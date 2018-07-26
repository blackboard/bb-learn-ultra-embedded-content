const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const parts = require('../../webpack.parts');

const PATHS = {
    app: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'lib'),
    public: '/',
};

const common = merge([
    {
        entry: {
            app: PATHS.app,
        },
        output: {
            path: PATHS.build,
            filename: 'index.js',
            publicPath: PATHS.public,
            libraryTarget: 'umd',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
        },
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
        ],
    },
]);

const buildProd = () => merge([
    common,
    {
        mode: 'production',
        plugins: [
            new webpack.HashedModuleIdsPlugin(),
        ],
    },
    parts.lintJavaScript({
        paths: PATHS.app,
        options: {
            emitWarning: true,
        },
    }),
    parts.setFreeVariable('process.env.NODE_ENV', 'production'),
    parts.minifyJavaScript({ useSourceMap: true }),
]);

const buildUmd = () => merge([
    buildProd(),
    parts.clean(PATHS.build),
    {
        output: {
            filename: 'index.js',
        },
    },
]);

module.exports = (env) => {
    process.env.BABEL_ENV = env;

    // if (env === 'production') {
    //     return [buildUmd()];
    // }

    return [buildUmd()];
};
