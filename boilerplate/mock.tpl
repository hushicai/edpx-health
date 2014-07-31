/**
 * @file ${filename}
 * @author ${author.name}(${author.email})
 */

<?php
require_once('${mockCommonPath}/header.php');

$smarty->template_dir = views_dir . "${moduleName}";

$smarty->display('${tplPath}');

