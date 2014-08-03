/**
 * @file 入口
 * @author hushicai(bluthcy@gmail.com)
 */
var fs = require('fs');
var path = require('path');

fs.readdirSync(__dirname + '/lib').forEach(
    function (file) {
        if (/\.js$/.test(file)) {
            file = file.replace(/\.js$/, '');
            exports[file] = require('./lib/' + file);
        }
    }
);

/**
 * 确保目录存在
 * 
 * @param {string} file 文件路径
 * @public
 */
exports.assertDir = function(file) {
    var dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
        require('mkdirp').sync(dir);
    }
}
