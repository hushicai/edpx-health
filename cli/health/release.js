/**
 * @file 发布
 * @author hushicai(bluthcy@gmail.com)
 */

// TODO:
// * 自动查找所有入口less文件，并更新到edp-buld-config.js中
// * 自动查找所有入口js文件，并更新到module.conf中
// 
// 
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

/**
 * 分析文件内容，提取所有less入口文件、js入口文件
 * 
 * @inner
 */
function analyse(files, projectInfo) {
    var projectRoot = projectInfo.dir;
    var lessFiles = [];
    var lessFilesHash = {};
    var jsFiles = [];
    var jsFilesHash = {};

    files.forEach(function(file) {
        var $ = cheerio.load(
            fs.readFileSync(
                path.resolve(projectRoot, 'views', file)
            )
        );

        var moduleName = path.dirname(file).split(path.sep)[0];
        var links = $('head link[href$="less"]');
        for(var i = 0, len = links.length; i < len; i++) {
            var link = links[i];
            var href = $(link).attr('href');
            var lessFile = href.replace(/\{\$common_host\}/i, 'common')
                .replace(/\{\$module_host\}/i, moduleName);

            if (!lessFilesHash[lessFile]) {
                lessFiles.push(lessFile);
                lessFilesHash[lessFile] = 1;
            }
        }
        var script = $('body script:last-child');
        if (script.length) {
            var text = script.text();
            var jsFile;
            text.replace(/require\(\s*\[(.+?)\]/, function($0, $1) {
                jsFile = $1 ? $1.split(',') : [];
            });

            if (jsFile) {
                jsFile.forEach(function(item) {
                    item = item.split(/['"]/)[1];
                    if (!jsFilesHash[item]) {
                        jsFiles.push(item);
                        jsFilesHash[item] = 1;
                    }
                });
            }
        }
    });

    lessFilesHash = null;
    jsFilesHash = null;

    console.log(lessFiles.join('\n'));
    console.log(jsFiles.join('\n'));
}

var cli = {};

cli.description = "发布";

cli.main = function() {
    var project = require('edp-project');
    var projectInfo = project.getInfo();
    var projectRoot = projectInfo.dir;
    var glob = require('glob');

    glob('**/*.tpl', {
        cwd: path.resolve(projectRoot, 'views')
    }, function(err, files) {
        analyse(files, projectInfo);
    });
};

exports.cli = cli;
