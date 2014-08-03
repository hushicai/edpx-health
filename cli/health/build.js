/**
 * @file 构建
 * @author hushicai(bluthcy@gmail.com)
 */

// * 自动查找所有入口less文件，并更新到less.conf中
// * 自动查找所有入口js文件，并更新到module.conf中
// 
var fs = require('fs');
var path = require('path');

/**
 * 合并配置
 * 将data中不存在于source中并且实际存在的文件添加到source中
 * 
 * @inner
 * @param {Array.<string>} source 原配置
 * @param {Array.<string>} data 新配置
 * @param {Object} projectInfo 项目配置
 * @return {Array.<string>} 
 */
function mergeConf(source, data) {
    var sourceHash = {};
    var isChanged = false;

    source.forEach(function(file) {
        sourceHash[file] = 1;
    });
    data.forEach(function(file) {
        if (!sourceHash[file]) {
            source.push(file);
            isChanged = true;
        }
    });

    return {
        data: source,
        isChanged: isChanged
    };
}

var FileFormat = {
    DOS: '\r\n',
    UNIX: '\n'
}

/**
 * 检测文件格式
 * 
 * @public
 * @param {string} content 文件内容
 * @return {string} 
 */
function checkFileFormat(content) {
    if (content.search(/\r\n/)) {
        return FileFormat.DOS;
    }

    return FileFormat.UNIX;
};

/**
 * 检测文件格式
 * 
 * @inner
 * @return {string} 
 */
function assertFileFormat(file, content) {
    var source = fs.readFileSync(file, 'utf-8');

    var sff = checkFileFormat(source);
    var cff = checkFileFormat(content);

    // 如果格式不一样，则转换目标内容的格式
    if (cff !== sff) {
        content = content.replace(new RegExp(cff, 'g'), sff);
    }

    return content;
}


/**
 * 分析文件内容，提取所有less入口文件、js入口文件
 * 
 * @inner
 * @param {Array.<string>} files 文件列表
 * @param {Object} projectInfo 项目信息
 */
function analyse(files, projectInfo) {
    var projectRoot = projectInfo.dir;
    var lessFiles = [];
    var lessFilesHash = {};
    var jsFiles = [];
    var jsFilesHash = {};

    files.forEach(function(file) {
        var content = fs.readFileSync(
            path.resolve(projectRoot, 'views', file),
            'utf-8'
        );

        var moduleName = path.dirname(file).split(path.sep)[0];

        content.replace(/\{\$(common|module)_host\}(.+?\.less)/g, function($0, $1, $2) {
            var lessFile = ($1 == 'common' ? 'common' : moduleName) + $2;
            if (lessFile && !lessFilesHash[lessFile]) {
                lessFiles.push('src/' + lessFile);
                lessFilesHash[lessFile] = 1;
            }
        });

        content.replace(/require\(\s*\[(.+?)\]/, function($0, $1) {
            var jsFile = $1 ? $1.split(',') : [];

            jsFile.forEach(function(item) {
                item = item.split(/['"]/)[1];
                if (!jsFilesHash[item]) {
                    jsFiles.push(item);
                    jsFilesHash[item] = 1;
                }
            });
        });
    });

    lessFilesHash = null;
    jsFilesHash = null;

    // 写入文件
    var lessConf = path.resolve(projectRoot, 'less.conf');
    var sourceLessFiles = require(lessConf);
    var cssConf = mergeConf(sourceLessFiles, lessFiles);
    if (cssConf.isChanged) {
        fs.writeFileSync(
            lessConf,
            'module.exports = ' + assertFileFormat(lessConf, JSON.stringify(cssConf.data, null, 4)) + ';',
            'utf-8'
        );
    }

    var moduleConf = path.resolve(projectRoot, 'module.conf');
    var moduleConfig = require('edp-project').module.getConfig(projectInfo);
    var sourceJsFiles = Object.keys(moduleConfig.combine);
    var jsConf = mergeConf(sourceJsFiles, jsFiles);
    if (jsConf.isChanged) {
        var combine = {};
        jsConf.data.forEach(function(item) {
            combine[item] = 1;
        });
        moduleConfig.combine = combine;
        fs.writeFileSync(
            moduleConf,
            assertFileFormat(moduleConf, JSON.stringify(moduleConfig, null, 4)),
            'utf-8'
        );
    }

    require('edp-build/cli/build').cli.main([], {
        force: true
    });
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
