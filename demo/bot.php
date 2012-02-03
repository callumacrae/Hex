<?php
require_once 'config.php';
require_once 'log.php';

class IRCBot{
	var $config = array();
	var $sock;
	function __construct(){
		global $config;
		$this->config = $config;
		$this->log = IRCBot_Log::getInstance($this);
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
			$this->log($data);
		}
		$ex = explode(" ",$data);
		if($ex[1] == "001"){ //Checks for code sent by IRC saying that a connection has been made
			$this->msg("NickServ","IDENTIFY {$this->config['core']['nickserv']}");
			$this->raw("JOIN {$this->config['core']['channels']}");
		}
		if($ex[0] == "PING"){
			$this->raw("PONG {$ex[1]}");
		}
		if(!feof($this->sock)){
			$this->main();
		}else{
			die($this->log->error("No longer connected.","core","IRCBot",null));
		}
	}
	
	function raw($msg){
		fputs($this->sock, $msg."\r\n");
		$this->error("sent", "Message was communicated to the server: {$msg}");
	}
	
	function error($type, $msg){
		switch ($type) {
			case "fatal":
				$send = true;
				break;
			
			case "warning": case "notice":
				if ($this->config['core']['debug'] == true || $this->config['core']['debug'] == "verbose") {
					$send = true;
				}
				break;
				
			case "sent":
				if ($this->config['core']['debug'] == 'verbose') {
					$send = true;
				}
				break;
		}
		if ($send == true) {
			$this->log("[{$type}] {$msg}");
		}
	}
	
	function log($msg){
		
	}
	
	function msg($chan,$msg){
		$this->raw("PRIVMSG $chan $msg");
	}
}
