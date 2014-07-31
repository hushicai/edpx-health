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

/**
 * 下载smarty
 * 
 * @private
 */
function downloadSmarty(projectInfo) {
    var edp = require('edp-core');
    var smartyPath = path.resolve(projectInfo.dir, 'mock', 'smarty');

    if (fs.existsSync(smartyPath)) {
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

        fs.createReadStream(smartyTarPath)
            .pipe(zlib.createGunzip())
            .pipe(tar.Extract({
                path: smartyPath,
                strip: 1
            }))
            .on('end', function() {
                fs.unlinkSync(smartyTarPath);
                edp.log.info('解压smarty到`' + smartyPath + '`中');
            });

        return;
    }
}

var cli = {};

cli.main = function() {
    var project = require('edp-project');

    try {
        var projectInfo = project.getInfo(process.cwd());
        project.dir.create('mock', projectInfo);
        project.dir.create('views', projectInfo);

        downloadSmarty(projectInfo);
    }
    catch (ex) {
        var edp = require('edp-core');
        edp.log.error('[edp health init] ' + ex.message);
        throw ex;
    }
};

exports.cli = cli;
