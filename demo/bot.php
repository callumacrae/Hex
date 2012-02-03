<?php
	class IRCBot{
		var $config = array();
		var $sock;
		function __construct(){
			include("config.php");
			$this->config = $config;
			unset($config);
			$serverdetails = explode(":",$this->config['core']['server']);
			if(!$this->sock = fsockopen($serverdetails[0],$serverdetails[1])){
				die($this->error("Failed to gain a connection"));
			}
			$this->raw("NICK {$this->config['core']['nick']}");
			$this->raw("USER {$this->config['core']['nick']} {$this->config['core']['nick']} {$this->config['core']['nick']} :{$this->config['core']['nick']}");
			$this->main();
		}
		function main(){
			$data = trim(fgets($this->sock));
			if($data != ""){
				$this->log($msg);
			}
			$ex = explode(" ",$data);
			if($ex[1] == "001"){ //Checks for code sent by IRC saying that a connection has been made
				$this->msg("NickServ","IDENTIFY {$this->config['core']['nickserv']}");
				$this->raw("JOIN {$this->config['core']['chans']}");
			}
			if($ex[0] == "PING"){
				$this->raw("PONG {$ex[1]}");
			}
		}
		function raw($msg){
			
		}
		function error($msg){
			
		}
		function log($msg){
			
		}
		function msg($chan,$msg){
			$this->raw("PRIVMSG $chan $msg");
		}
	}
?>