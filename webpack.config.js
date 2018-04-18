
const argv = require("yargs").argv;
const webpack = require("webpack");

const webpackConfigAssign = require("webpack-config-assign");

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackNotifierPlugin = require("webpack-notifier");

const makeExternal = (name) => {
    return {
        commonjs2: name,
        commonjs: name,
        amd: name,
        umd: name
    };
};

const webConfig = {
    entry: "./ts/index.ts",

    mode: "development",

    output: {
        path: __dirname + "/dist",
        filename: "react-math-menu.js",
        library: "MathMenu",
        libraryTarget: "commonjs2"
    },

    devtool: "eval-source-map",

    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js", ".tsx"],
        modules: ["web_modules", "node_modules", "js"]
    },

    externals: {
        react: makeExternal("react"),
        "react-dom": makeExternal("react-dom"),
        "material-ui": makeExternal("material-ui"),
        "react-addons-transition-group": makeExternal("react-addons-transition-group"),
        "react-addons-pure-render-mixin": makeExternal("react-addons-pure-render-mixin"),
        "react-addons-create-fragment": makeExternal("react-addons-create-fragment"),
        "react-addons-update": makeExternal("react-addons-update")
    },

    plugins: [
        new WebpackNotifierPlugin({alwaysNotify: true})
    ],

    module: {
        rules: [
            { test: /\.tsx?$/, use: "ts-loader" },
            { test: /\.js$/, loader: "source-map-loader" },
            { test: /\.(png|svg|jpg|gif)$/, use: [{
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                    outputPath: "images/"
                }
            }]
            }
        ]
    }
};

if (argv.profile) {
    webConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = [webConfig];
