/**
 * @file 添加页面模块
 * @author hushicai(bluthcy@gmail.com)
 */

var fs = require('fs');
var path = require('path');

var health = require('../../index');

var assertDir = health.assertDir;

/**
 * 生成文件
 * 
 * @inner
 */
function generateFile(name, file, data) {
    return health.scaffold.create(name, file, data);
}

/**
 * 生成模块
 * 
 * @inner
 */
function genModule(moduleName, projectInfo) {
    var project = require('edp-project');

    project.dir.create(
        path.resolve('mock', moduleName),
        projectInfo
    );

    project.dir.create(
        path.resolve('views', moduleName),
        projectInfo
    );

    project.dir.create(
        path.resolve('src', moduleName, 'img'),
        projectInfo
    );
    project.dir.create(
        path.resolve('src', moduleName, 'css'),
        projectInfo
    );
}

/**
 * 生成子频道以及页面
 * 
 * @inner
 */
function genPage(moduleName, pageName, projectInfo) {
    var projectRoot = projectInfo.dir;

    // 生成less文件
    var lessFile = path.resolve(projectRoot, 'src', moduleName, 'css', pageName) + '.less';
    assertDir(lessFile);
    generateFile('less', lessFile);

    // 生成js文件
    var jsFile = path.resolve(projectRoot, 'src', moduleName, pageName) + '.js';
    assertDir(jsFile);
    generateFile('js', jsFile);

    // 生成tpl文件
    var tplFile = path.resolve(projectRoot, 'views', moduleName, pageName) + '.tpl';
    assertDir(tplFile);
    generateFile('view', tplFile, {
        // 模块名
        moduleName: moduleName,
        pageName: pageName,
        // common目录相对于tplFile的路径
        viewCommonPath: path.relative(path.dirname(tplFile), path.resolve(projectRoot, 'views', 'common')),
        // log cat 标志
        logCat: moduleName + pageName.replace(/(^|\/)([a-z])/gi, function($0, $1, $2) {
            return $2.toUpperCase();
        })
    });

    // 生成mock文件
    var mockFile = path.resolve(projectRoot, 'mock', moduleName, pageName) + '.php';
    assertDir(mockFile);
    generateFile('mock', mockFile, {
        moduleName: moduleName,
        // mockFile相对于common目录的路径
        mockCommonPath: path.relative(path.dirname(mockFile), path.resolve(projectRoot, 'mock', 'common')),
        tplPath: path.relative(path.resolve(projectRoot, 'views', moduleName), tplFile)
    });
}

var cli = {};

cli.description = "添加文件";

cli.main = function(args) {
    var edp = require('edp-core');

    if (args.length === 0) {
        edp.log.info('请提供路径名');
        return;
    }

    var project = require('edp-project');
    var projectInfo = project.getInfo();
    var pathname = args[0];

    if (pathname.charAt(pathname.length - 1) == '/') {
        pathname += 'index';
    }

    var items = pathname.split(path.sep);
    var moduleName = items.shift();
    genModule(moduleName, projectInfo);

    if (items.length) {
        var pageName = items.join(path.sep);
        genPage(moduleName, pageName, projectInfo);
    }
};

exports.cli = cli;
