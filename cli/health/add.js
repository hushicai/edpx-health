/**
 * @file 添加页面模块
 * @author hushicai(bluthcy@gmail.com)
 */

var fs = require('fs');
var path = require('path');

/**
 * 确保文件所在的文件夹存在
 *
 * @inner
 * @param {string} file 文件
 */
function assetDir(file) {
    var dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
        require('mkdirp').sync(dir);
    }
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
    var health = require('../../index');
    var scaffold = health.scaffold;

    var projectRoot = projectInfo.dir;

    var mockFile = path.resolve(projectRoot, 'mock', moduleName, pageName) + '.php';
    assetDir(mockFile);
    scaffold.generate('mock', mockFile);

    var lessFile = path.resolve(projectRoot, 'src', moduleName, 'css', pageName) + '.less';
    assetDir(lessFile);
    scaffold.generate('less', lessFile);

    // js默认以main为入口
    var jsFile = path.resolve(projectRoot, 'src', moduleName, pageName) + '.js';
    assetDir(jsFile);
    scaffold.generate('js', jsFile);

    var tplFile = path.resolve(projectRoot, 'views', moduleName, pageName) + '.tpl';
    var viewCommonPath = path.resolve(projectRoot, 'views', 'common');
    assetDir(tplFile);
    scaffold.generate('view', tplFile, {
        // 模块名
        moduleName: moduleName,
        // less文件相对于css目录的路径
        lessPath: pageName + '.less',
        viewCommonPath: path.relative(tplFile, viewCommonPath),
        // log cat 标志
        logCat: moduleName + pageName.replace(/(^|\/)([a-z])/gi, function($0, $1, $2) {
            return $2.toUpperCase();
        })
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
