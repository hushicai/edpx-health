<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>百度健康</title>
    {include file="${viewCommonPath}/conf.tpl" module="${moduleName}"}
    <link href="{$common_host}/css/main.less" rel="stylesheet" />
    <link href="{$module_host}/css/${lessPath}" rel="stylesheet" />
    <link href="http://www.baidu.com/favicon.ico" rel="shortcut icon" />
</head>

<body>
    {include file="${viewCommonPath}/header.tpl"}
    {strip}
    <div class="main">
        <div class="container">
        </div>
    </div>
    {/strip}
    <div id="footer-nav"></div>
    {include file="${viewCommonPath}/widgets.tpl"}
    <script type="text/javascript">
        var LOG_DATA = {
            cat: '${logCat}'
        };
    </script>
    {include file="${viewCommonPath}/script.tpl"}
    <script type="text/javascript">
        define('global/pageData', {
            // global data  
        });
    </script>
</body>
</html>
