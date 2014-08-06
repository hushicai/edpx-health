{strip}
{if !empty($health_host)}
    {assign var="ASSET" value=$health_host}
{elseif !empty($root)}
    {assign var="ASSET" value=$root}
{elseif !empty($root)}
{elseif !empty($base_dir)}
    {assign var="ASSET" value=$base_dir}
{else}
    {assign var="ASSET" value=$base_url}
{/if}

{assign var="module_host" value="{$ASSET}/{$module}" scope="global"}
{assign var="common_host" value="{$ASSET}/common" scope="global"}
{assign var="base_url" value="{$ASSET}" scope="global"}
{/strip}
