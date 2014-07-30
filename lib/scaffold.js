/**
 * @file 文件脚手架
 * @author hushicai(bluthcy@gmail.com)
 */

var fs = require('fs');
var path = require('path');

/**
 * 获取模板文件内容
 * 
 * @public
 * @param {string} name 模板文件名
 * @return {string} 文件内容
 */
exports.get = function(name) {
    var file = path.resolve(__dirname, '../boilerplate', name) + '.tpl';

    return fs.readFileSync(file, 'utf-8');
};

/**
 * 生成文件
 *
 * @public
 * @param {string} name 模版名称
 * @param {string} file 生成文件路径
 * @param {Object=} data 模版数据
 */
exports.generate = function (name, file, data) {
    var edpConfig = require('edp-config');

    data = data || {};
    data.filename = path.basename(file);
    data.author = {
        name: edpConfig.get('user.name'),
        email: edpConfig.get('user.email')
    };

    var etpl = require('etpl');
    var tpl = exports.get(name);
    var tplEngine = new etpl.Engine();
    var render = tplEngine.compile(tpl);
    var content = render(data || {});

    return fs.writeFileSync(file, content, 'utf-8');
};
