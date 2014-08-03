/**
 * @file 发布
 * @author hushicai(bluthcy@gmail.com)
 */

var edp = require('edp-core');
var path = require('path');
var fs = require('fs');

var cli = {};

cli.options = [];

cli.main = function(args, opts) {
    var project = require('edp-project');
    var projectInfo = project.getInfo();
    var projectRoot = projectInfo.dir;

    var conf = require(path.resolve(projectRoot, 'edp-build-config.js'));
    var buildOutputDir = path.resolve(projectRoot, conf.output);

    if (!fs.existsSync(buildOutputDir)) {
        edp.log.warn('没有`edp health build`后的目录，请先`build`后，再`release`');
        return;
    }

    var dist = require(
        path.resolve(projectRoot, "release.conf")
    ).dist;

    if (!dist) {
        edp.log.error("请在`release.conf`中配置`dist`目标路径");
        return;
    }

    dist = path.resolve(projectRoot, dist);

    var glob = require('glob');

    glob('**/*', {
        cwd: buildOutputDir
    }, function(err, files) {
        files.forEach(function(file) {
            var srcFile = path.resolve(buildOutputDir, file);
            var distFile = path.resolve(dist, file);
            if (fs.statSync(srcFile).isFile()) {
                require('../../index').assertDir(distFile);
                fs.renameSync(srcFile, distFile);
            }
        });

        edp.util.rmdir(buildOutputDir);
    });
}

exports.cli = cli;
