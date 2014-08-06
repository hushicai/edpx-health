<script src="http://libs.baidu.com/jquery/1.9.0/jquery.min.js"></script>
<script src="http://s1.bdstatic.com/r/www/cache/ecom/esl/1-8-2/esl.js"></script>
<script>
    <!-- edp: 
    {
        "preserveBaseUrl": true
    }
    -->
    require.config({
        baseUrl: '{$base_url}'
    });

    define('jquery', function(require) {
        return $;
    });
</script>
