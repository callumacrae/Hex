<?php
ini_set("display_errors","on");

function getarg($arg){
	global $argv;
	foreach($argv as $argu){
		if($argu == $arg){
			return true;
		}
	}
	return false;
}
if(getarg("debug") == true){
	error_reporting(E_ALL);
}else{
	error_reporting(E_ERROR);
}
require_once 'bot.php';

$bot = new IRCBot();

