const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = {
    entry: [
        path.join(__dirname, 'src', 'resume.js'),
        path.join(__dirname, 'src', 'sass', 'app.scss')
    ],
    mode: "production",
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {sourceMap: true}},
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: ['./node_modules']
                            },
                            sourceMap: true,
                        }
                    },
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|png|jpeg)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset/inline',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                },
            }
        ]
    },
    plugins: [
        // Factories as templatePath is dynamic
        // Plugins are created every bundle request in index.js
        //(templatePath) => new HtmlWebpackPlugin({
        //        template: templatePath,
        //        //inlineSource: '.(js|css)$'
        //    }
        //),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: 'template.html',
        }),
        new HtmlInlineScriptPlugin(),
        new HTMLInlineCSSWebpackPlugin({
            leaveCSSFile: true,
            styleTagFactory({style}) {
                return `<style>${style}</style>`;
            },
        }),
    ],
};
