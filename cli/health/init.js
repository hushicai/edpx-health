/**
 * @file 初始化
 * @author hushicai(bluthcy@gmail.com)
 */

// TODO:
// 做一些基本的配置，比如`edp-webserver-config.js`
// 

var fs = require('fs');
var http = require('http');
var path = require('path');
var zlib = require('zlib');

var edp = require('edp-core');

/**
 * 下载smarty
 * 
 * @private
 */
function downloadSmarty(projectInfo) {
    var smartyLibsPath = path.resolve(projectInfo.dir, 'mock', 'libs');

    if (fs.existsSync(smartyLibsPath)) {
        return;
    }

    edp.log.info('下载smarty发行包...');

    var smartyDownloadLink = 'http://www.smarty.net/files/Smarty-3.1.19.tar.gz';
    var smartyTarPath = path.resolve(projectInfo.dir, 'mock', 'smarty.tar.gz');
    var wstream = fs.createWriteStream(smartyTarPath);

    // 下载文件
    http.get(smartyDownloadLink, function(res) {
        res.on('data', function(data) {
            wstream.write(data);
        }).on('end', function() {
            wstream.end();
            extract();
        });
    });

    /**
     * 解压文件
     * 
     * @inner
     */
    function extract() {
        edp.log.info('解压smarty...');

        var tar = require('tar');
        var smartyPath = path.resolve(projectInfo.dir, 'mock', 'smarty');

        fs.createReadStream(smartyTarPath)
            .pipe(zlib.createGunzip())
            .pipe(tar.Extract({
                path: smartyPath,
                strip: 1
            }))
            .on('end', function() {
                fs.unlinkSync(smartyTarPath);
                require('wrench').copyDirSyncRecursive(
                    path.resolve(smartyPath, 'libs'),
                    smartyLibsPath
                );
                edp.util.rmdir(smartyPath);
                edp.log.info('成功安装smarty至`' + smartyLibsPath + '`');
            });

        return;
    }
}

var cli = {};

cli.main = function() {
    try {
        require('edp-project/cli/project/init').cli.main();
    }
    catch(ex) {
        return;
    }

    var project = require('edp-project');
    var projectInfo = project.getInfo(process.cwd());

    project.dir.create('mock/common', projectInfo);
    project.dir.create('views/common', projectInfo);
    project.dir.create('src/common/css', projectInfo);
    project.dir.create('src/common/img', projectInfo);

    var projectRoot = projectInfo.dir;
    var scaffold = require('../../index').scaffold;

    scaffold.generate(
        'webserver-config',
        path.resolve(projectRoot, 'edp-webserver-config.js')
    );
    scaffold.generate(
        'bowerrc',
        path.resolve(projectRoot, '.bowerrc')
    );
    scaffold.create(
        'mock.header',
        path.resolve(projectRoot, 'mock/common/header.php')
    );
    scaffold.create(
        'less.common',
        path.resolve(projectRoot, 'src/common/css/main.less')
    );
    scaffold.create(
        'view.conf',
        path.resolve(projectRoot, 'views/common/conf.tpl')
    );
    scaffold.create(
        'view.script',
        path.resolve(projectRoot, 'views/common/script.tpl')
    );
    scaffold.create(
        'view.header',
        path.resolve(projectRoot, 'views/common/header.tpl')
    );
    scaffold.create(
        'view.widgets',
        path.resolve(projectRoot, 'views/common/widgets.tpl')
    );
    scaffold.create(
        'view.footer',
        path.resolve(projectRoot, 'views/common/footer.tpl')
    );

    downloadSmarty(projectInfo);
};

exports.cli = cli;
