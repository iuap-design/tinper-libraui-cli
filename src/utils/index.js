const rp = require('request-promise');
const path = require('path');
const fse = require('fs-extra');
const defaultLib = [{
    key: 'react',
    value: 'React',
    js: '//design.yonyoucloud.com/static/react/16.8.4/umd/react.production.min.js',
    css: '',
},
{
    key: 'react-dom',
    value: 'ReactDOM',
    js: '//design.yonyoucloud.com/static/react/16.8.4/umd/react-dom.production.min.js',
    css: ''
},]

const download = async (options, filename, cb) => {
    let opts = {
        method: 'get',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': 1
        }
    }
    opts = { ...opts, ...options };
    // 获得文件夹路径
    let fileFolder = path.dirname(filename);
    // 创建文件夹
    fse.ensureDirSync(fileFolder);
    // 开始下载无需返回
    rp(opts).pipe(fse.createWriteStream(filename)).on('close', cb);
}

/**
 * 下载zip压缩包包含路径文件名
 */
const getRemoteZip = (url) => {
    // let url = `http://iuap-design-cdn.oss-cn-beijing.aliyuncs.com/static/ucf/templates/latest/ucf-webapp-master.zip`
    return new Promise((resolve, reject) => {
        download({ url }, `ucf-webapp-master.tmp`, () => {
            resolve({ success: true });
        });
    });
}

// const getDir = (_path = '.', type = 'dir',  exclude = {}) => {
//     console.log(path.resolve(_path));
//     const arr = fse.readdirSync(path.resolve(_path));
//     switch (type) {
//         case 'file': return arr.filter(item => item.includes('.'));
//         case 'dir': return arr.filter(item => !(item.includes('.') || exclude[item]));
//         case 'all': default: return arr;
//     }
// }
const getDir = (_path = '.', type = 'dir', config = {}) => {
    const arr = fse.readdirSync(path.resolve(_path));
    const isNeed = (item) => (!config.include || config.include.test(item)) && (!config.exclude || !config.exclude.test(item));
    switch (type) {
        case 'file': return arr.filter(item => item.includes('.') && isNeed(item));
        case 'dir': return arr.filter(item => !item.includes('.') && isNeed(item));
        case 'all': default: return arr;
    }
}

const getLib = () => {
    // const libraConfig = require(path.resolve('./libra.config.js'));
    // const { lib } = libraConfig;
    const libraConfig = getLibraConfig();
    const { lib } = libraConfig;
    return [...defaultLib, ...lib]
}

const getLibraConfig = () => {
    // let config = require(path.resolve('./libra.config.js'));
    let configJson = fse.readJsonSync(path.resolve('./libra.config.json'));
    const { type } = configJson;
    const suffixType = type === 'ts' ? 'tsx' : 'js';
    return { ...configJson, suffixType };
}
module.exports = {
    download,
    getRemoteZip,
    getDir,
    getLib,
    getLibraConfig
}