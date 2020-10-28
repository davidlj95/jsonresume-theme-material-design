const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const FontawesomeHelper = require('./src/helpers/fontawesome.helper');
const LocationHelper = require('./src/helpers/location.helper');
const PreloadImageHelper = require('./src/helpers/preload-image.helper');
const {levelToStarsHelper, levelDefaultHelper} = require('./src/helpers/level.helpers');
const appTitleHelper = require('./src/helpers/app-title.helper');
const tmp = require('tmp');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const requireUncached = require('require-uncached');
const helpers = require('handlebars-helpers');

async function render(resume) {
    fixResumeSchemaChanges(resume)
    return bundleResumeHtml(
        renderTemplate(resume)
    );
}

function fixResumeSchemaChanges(resume) {
    if (resume && resume.work && resume.work.length) {
        resume.work.map(w => {
            if (w.url) return
            if (!w.website) return
            w.url = w.website
        })
    }
}

function renderTemplate(resume) {
    const sourcesPath = path.join(__dirname, "src");
    const templatePath = path.join(sourcesPath, "resume.hbs");
    const partialsPath = path.join(sourcesPath, "partials");

    const template = fs.readFileSync(templatePath, "utf-8");

    registerPartials(partialsPath);
    registerHelpers();

    const options = requireUncached('./options');
    return Handlebars.compile(template)({
        resume,
        options
    });
}

function registerPartials(partialsPath) {
    const filenames = fs.readdirSync(partialsPath);
    filenames.forEach(function (filename) {
        const matches = /^([^.]+).hbs$/.exec(filename);
        if (!matches) {
            return;
        }
        const name = matches[1];
        const filepath = path.join(partialsPath, filename);
        const template = fs.readFileSync(filepath, 'utf8');

        Handlebars.registerPartial(name, template);
    });
}

function registerHelpers() {
    Handlebars.registerHelper("fontawesome", FontawesomeHelper);
    Handlebars.registerHelper("locationAsString", LocationHelper);
    Handlebars.registerHelper("preloadImage", PreloadImageHelper);
    Handlebars.registerHelper("levelToStars", levelToStarsHelper);
    Handlebars.registerHelper("levelDefault", levelDefaultHelper);
    Handlebars.registerHelper("appTitle", appTitleHelper);
    helpers({
        handlebars: Handlebars
    });
}

async function bundleResumeHtml(resumeHtml) {
    const tmpDirObj = tmp.dirSync();
    const tmpDir = tmpDirObj.name;

    const templateHtmlPath = path.join(tmpDir, "template.html");
    fs.writeFileSync(templateHtmlPath, resumeHtml, "utf-8");

    const distPath = path.join(tmpDir, "dist");

    const config = getWebpackConfig(distPath, templateHtmlPath);
    const compiler = webpack(config);
    const results = await runCompiler(compiler);
    const resultPath = path.join(distPath, "index.html");
    try {
        const resultHtml = fs.readFileSync(resultPath);
        return resultHtml.toString();
    } catch {
        return `Webpack did not bundle properly: ${results.compilation.errors}`;
    } finally {
        tmpDirObj.removeCallback();
    }
}

function getWebpackConfig(distPath, templatePath) {
    const baseConfig = Object.assign({}, webpackConfig);
    baseConfig.output.path = distPath;
    baseConfig.plugins = webpackConfig.plugins.map(pluginFactory => pluginFactory(templatePath));
    // const htmlWebpackPlugin = baseConfig.plugins.find(plugin => plugin.constructor.name === "HtmlWebpackPlugin");
    // if (!htmlWebpackPlugin) {
    //     throw Error('No HtmlWebpackPlugin');
    // }
    // htmlWebpackPlugin.options.template = templatePath;
    return baseConfig;
}

function runCompiler(compiler) {
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                reject(err)
            } else {
                resolve(stats);
            }
        });
    });
}

module.exports = {
    render: render
};
