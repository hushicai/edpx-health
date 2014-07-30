/**
 * @file 初始化
 * @author hushicai(bluthcy@gmail.com)
 */

var cli = {};

cli.main = function() {
    var project = require('edp-project');

    try {
        var projectInfo = project.getInfo(process.cwd());
        project.dir.create('mock', projectInfo);
        project.dir.create('views', projectInfo);
    }
    catch ( ex ) {
        var edp = require('edp-core');
        edp.log.error('[edp health init] ' + ex.message);
        throw ex;
    }
};

exports.cli = cli;
