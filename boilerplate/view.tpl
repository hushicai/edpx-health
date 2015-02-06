{strip}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>百度健康</title>
    {include file="${viewCommonPath}/conf.tpl" module="${moduleName}"}
    <link href="{$common_host}/css/main.less" rel="stylesheet" />
    <link href="{$module_host}/css/${pageName}.less" rel="stylesheet" />
    <link href="http://www.baidu.com/favicon.ico" rel="shortcut icon" />
</head>

<body>
    {include file="${viewCommonPath}/header.tpl"}

    <div class="main">
        <div class="container">
        </div>
    </div>

    {include file="${viewCommonPath}/footer.tpl"}

    <script>
        var LOG_DATA = {
            cat: '${logCat}'
        };
    </script>

    {include file="${viewCommonPath}/script.tpl"}

    <script>
        require(['${moduleName}/${pageName}'], function(page) {
            page.init();
        });
    </script>
</body>
</html>
{/strip}
