// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require("copy-webpack-plugin");
// const Dotenv = require('dotenv-webpack');

// module.exports = {
//     entry: './src/app.ts',
//     devtool: 'inline-source-map',
//     mode: 'development',
//     output: {
//         filename: 'app.ts',
//         path: path.resolve(__dirname, 'dist'),
//         publicPath: '/'
//     },
//     devServer: {
//         static: {
//             directory: path.join(__dirname, 'public'),
//         },
//         compress: true,
//         port: 9000,
//         historyApiFallback: true,
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.scss$/i,
//                 use: [
//                     // Creates `style` nodes from JS strings
//                     "style-loader",
//                     // Translates CSS into CommonJS
//                     "css-loader",
//                     // Compiles Sass to CSS
//                     "sass-loader",
//                 ],
//             },
//             {
//                 test: /\.tsx?$/,
//                 use: 'ts-loader',
//                 exclude: /node_modules/,
//             },
//         ],
//     },
//     resolve: {
//         extensions: ['.tsx', '.ts', '.js'],
//     },
//     plugins: [
//         // new Dotenv(),
//         new HtmlWebpackPlugin({
//             template: './index.html',
//             baseUrl: '/',
//         }),
//         new CopyPlugin({
//             patterns: [
//                 {from: "./src/templates", to: "templates"},
//                 {from: "./src/static/images", to: "images"},
//                 {from: "./node_modules/jquery/dist/jquery.js", to: "js"},
//                 {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.js", to: "js"},
//                 {from: "./node_modules/bootstrap/dist/js/bootstrap.js", to: "js"},
//                 {from: "./node_modules/chart.js/dist/chart.js", to: "js"},
//                 // {from: "./.env", to: "./"},
//             ],
//         }),
//
//     ],
//
//
// };

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
    entry: './src/app.ts',
    mode: "development",
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
// Translates CSS into CommonJS
                    "css-loader",
// Compiles Sass to CSS
                    "sass-loader",
                ],
            },

        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'app.min.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/'

    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: false,
        port: 9000,
        historyApiFallback: true,

    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            baseUrl: '/',

        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static/images", to: "images"},
                {from: "./node_modules/jquery/dist/jquery.js", to: "js"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.js", to: "js"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.js", to: "js"},
                {from: "./node_modules/chart.js/dist/chart.js", to: "js"},
            ],
        }),
    ],
};

