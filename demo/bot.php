<?php
	class IRCBot{
		var $config = array();
		var $sock;
		function __construct(){
			include("config.php");
			$this->config = $config;
			unset($config);
			$serverdetails = explode(":",$this->config['server']);
			if(!$this->sock = fsockopen($serverdetails[0],$serverdetails[1])){
				die($this->error("Failed to gain a connection"));
			}
			$this->raw();
			$this->main();
		}
		function main(){
			
		}
		function raw($msg){
			
		}
		function error($msg){
			
		}
		function log($msg){
			
		}
	}
?>