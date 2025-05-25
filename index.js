const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const {createFsFromVolume, Volume} = require("memfs");

async function render (resume) {
    const compiler = webpack(webpackConfig({production: true}, [], resume));
    const fs = createFsFromVolume(new Volume())
    compiler.outputFileSystem = fs
    const results = await runCompiler(compiler);
    if(results.compilation.errors.length) {
        console.error(results.compilation.errors)
        throw new Error("Webpack compilation failed")
    }
    const content = fs.readFileSync(path.join(compiler.outputPath, 'index.html'), 'utf8');
    compiler.close((closeErr) => {
        if(closeErr) {
            console.error("Webpack error while closing", closeErr)
        }
    })
    return content;
}

const runCompiler = (compiler) => new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
        err ? reject(err) : resolve(stats);
    });
})

module.exports = { render }
