/**
 * @file 启动调试
 * @author hushicai(bluthcy@gmail.com)
 */

// TODO:
// * 环境检查，比如检查php-cgi是否存在环境变量中
// * ...

var cli = {};

cli.description = '启动server';

cli.main = function() {
    return require('edp-webserver').start();
};

exports.cli = cli;
