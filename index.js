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
    return bundleResumeHtml(renderTemplate(resume));
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
    // Render resume in a file
    const templateHtmlPath = "template.html";
    fs.writeFileSync(templateHtmlPath, resumeHtml, "utf-8");

    // Add CSS & JS inlined with webpack, taking resume as template
    const compiler = webpack(webpackConfig);
    const results = await runCompiler(compiler);

    // Return the HTML generated, with bundled CSS & JS
    const resultPath = path.join("dist", "index.html");
    try {
        const resultHtml = fs.readFileSync(resultPath);
        return resultHtml.toString();
    } catch {
        return `Webpack did not bundle properly: ${results.compilation.errors}`;
    }
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
    render: render,
    renderTemplate: renderTemplate,
};