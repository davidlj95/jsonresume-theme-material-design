const HtmlBundlerPlugin = require("html-bundler-webpack-plugin");
const {join} = require('path');
const registerHandlebarsHelpers = require('handlebars-helpers');

const configDir = __dirname
const srcDir = join(configDir, 'src')
const defaultResumeFile = join(configDir, 'resume.json')

registerHandlebarsHelpers()
module.exports = function (env, argv, resume) {
    return {
        plugins: [
            new HtmlBundlerPlugin({
                entry: {
                    index: {
                        import: join(srcDir, 'resume.hbs'),
                        data: resume ?? defaultResumeFile,
                    }
                },
                preprocessor: 'handlebars',
                preprocessorOptions: {
                    partials: [join(srcDir, 'partials')],
                    helpers: [join(srcDir, 'helpers')],
                },
                css: {
                    inline: true,
                },
                js: {
                    inline: true,
                }
            }),
        ],
        mode: env.production ? 'production' : 'development',
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
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
        devServer: {
            watchFiles: {
                paths: [`${srcDir}/**/*`, defaultResumeFile]
            },
            client: {
                overlay: {
                    warnings: false
                }
            }
        }
    }
}
