const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const FontawesomeHelper = require('./src/helpers/fontawesome.helper');
const LocationHelper = require('./src/helpers/location.helper');
const PreloadImageHelper = require('./src/helpers/preload-image.helper');
const {skillLevelToStarsHelper, unknownSkillLevelHelper} = require('./src/helpers/skill-level.helpers');
const tmp = require('tmp');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

function render(resume) {
    return bundleResumeHtml(
        renderTemplate(resume)
    );
}

function renderTemplate(resume) {
    const sourcesPath = path.join(__dirname, "src");
    const templatePath = path.join(sourcesPath, "resume.hbs");
    const partialsPath = path.join(sourcesPath, "partials");

    const template = fs.readFileSync(templatePath, "utf-8");

    registerPartials(partialsPath);
    registerHelpers();

    return Handlebars.compile(template)({
        resume: resume,
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
    Handlebars.registerHelper("skillLevelToStars", skillLevelToStarsHelper);
    Handlebars.registerHelper("skillLevelDefault", unknownSkillLevelHelper);
}

async function bundleResumeHtml(resumeHtml) {
    const tmpDirObj = tmp.dirSync();
    const tmpDir = tmpDirObj.name;

    const templateHtmlPath = path.join(tmpDir, "template.html");
    fs.writeFileSync(templateHtmlPath, resumeHtml, "utf-8");

    const distPath = path.join(tmpDir, "dist");

    const config = getWebpackConfig(distPath, templateHtmlPath);
    const compiler = webpack(config);
    await runCompiler(compiler);
    const resultPath = path.join(distPath, "index.html");
    try {
        const resultHtml = fs.readFileSync(resultPath);
        return resultHtml.toString();
    } catch (e) {
        return "Webpack did not bundle properly";
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
