const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const runGulp = require('../gulp/index');
const baseConfig = require('../webpack/webpack.base.config');
const buildConfig = require('../webpack/webpack.build.config');
const demoConfig = require('../webpack/webpack.demo.config');
const lessConfig = require('../webpack/webpack.less2css.config');
const writeResources = require('../utils/writeResources');
const writeBuildEntry = require('../utils/writeBuildEntry');
const copyFile = require('../utils/copyFile');
// 打包产出dist文件
const buildDist = () => {
    const webpackConfig = webpackMerge(baseConfig(),buildConfig());
    const compiler = webpack(webpackConfig);
    compiler.run( (err, status) => {
        if(err){
            console.error(err);
        }
        else {
            console.log('build dist file success ')
        }
    })
}

const buildDemo = () => {
    const webpackConfig = webpackMerge(baseConfig(),demoConfig('build'));
    const compiler = webpack(webpackConfig);
    compiler.run( (err, status) => {
        if(err){
            console.error(err);
        }
        else {
            console.log('build demo file success ')
        }
    })
}

// 产出lib文件
const buildLib = () => {
    // runGulp(['javascript','less','css','img']);
    const webpackConfig = webpackMerge(baseConfig(),lessConfig());
    const compiler = webpack(webpackConfig);
    compiler.run( (err, status) => {
        if(err){
            console.error(err);
        }
        else {
            console.log('build lib file success ')
        }
    })
    runGulp(['build']);
}

// 产出其他文件，如package.json等
const buildExtra = () => {
    // runGulp(['extra'])
    copyFile('./package.json','./.libraui/package.json');
    copyFile('./README.md','./.libraui/README.md');
}

const build =  () => {
    writeBuildEntry();
    writeResources('build');
    buildDist(); 
    buildLib(); 
    buildExtra();
    buildDemo();
}

module.exports = build;