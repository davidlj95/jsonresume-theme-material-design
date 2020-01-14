const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
    entry: [
        path.join(__dirname, 'src', 'resume.js'),
        path.join(__dirname, 'src', 'sass', 'app.scss')
    ],
    output: {
        filename: 'bundle.js',
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: ['./node_modules']
                            }
                        }
                    },
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|png|jpeg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'url-loader'
                    }
                ]
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
        (templatePath) => new HtmlWebpackPlugin({
                template: templatePath,
                inlineSource: '.(js|css)$'
            }
        ),
        () => new MiniCssExtractPlugin(),
        () => new HtmlWebpackInlineSourcePlugin(),
    ],
};
