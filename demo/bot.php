<?php
require_once 'config.php';
require_once 'log.php';

class IRCBot{
	private $config = array();
	private $sock;
	private $modulewarning = array();
	private $log;

	function __construct(){
		global $config;
		$this->config = $config;
		$this->log = IRCBot_Log::getInstance($this);

		$serverdetails = explode(":",$this->config['core']['server']);
		if(!$this->sock = fsockopen($serverdetails[0],$serverdetails[1])){
			$this->log->error("Failed to gain a connection", "core", 'construct', null, IRCBot_Log::TO_FILE | IRCBot_Log::TO_EMAIL | IRCBot_Log::TO_STDOUT);
			die(1);
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
		if(isset($ex[1])){
			if($ex[1] == "001"){ //Checks for code sent by IRC saying that a connection has been made
				$this->msg("NickServ","IDENTIFY {$this->config['core']['nickserv']}");
				$this->raw("JOIN {$this->config['core']['channels']}");
			}
		}
		if($ex[0] == "PING"){
			$this->raw("PONG {$ex[1]}", true);
		}
		if(isset($ex[2])){
			$chan = $ex[2];
			$chanl = strtolower($chan);
		}
		$cmd = substr($ex[3],1); //Trim : from the begining
		$cmdl = strtolower($cmd);
		$subcmd = $ex[4];
		$subcmdl = strtolower($subcmd);
		$modules = glob("./modules/*.php");
		foreach($modules as $module){
			if (!include($module)) { //This should not be include_once to allow dynamic module editing.
				if($this->modulewarning[$module] != true){
					$this->log->error("{$module} module could not be loaded", "core", "loader");
					$this->modulewarning[$module] = true;
				}
			}else{
				$this->modulewarning[$module] = false;
			}
			//TODO implement actual loader
			//since we should implement all the modules as clases, they need to be loaded, and have hooks that can be registered. e.g: on_privmsg_receive(), on_user_join(), on_user_part(), on_message_receive(), etc.
			//speak to me for my take on this - xav0989
		}
		if(!feof($this->sock)){
			$this->main();
		}else{
			$this->log->error("No longer connected.","core","IRCBot",null, IRCBot_Log::TO_FILE | IRCBot_Log::TO_STDOUT | IRCBot_Log::TO_EMAIL);
			die(1);
		}
	}
	
	function reply($msg) {
		$nick = explode("!", $this->ex[0]);
		$nick = substr($nick[0], 1);
		$this->msg($this->ex[2], "{$nick}: {$msg}");
	}
	
	function raw($msg, $skip=false){
		if (!$skip) {
			$this->log->info("Sending message to server", "core", "raw");
		}

		if (fputs($this->sock, $msg."\r\n") !== false) {
			if (!$skip) {
				$this->log->debug("Message was communicated to the server: {$msg}", 'core', 'raw');
			}
			return true;
		}
		if (!$skip) {
			$this->log->error("There was a problem sending: \'$msg\'", 'core', 'raw');
		}
		if ($skip) {
			//to prevent cyclical errors.
			return true;
		}
		return false;
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
		var_dump($msg);
			$this->log("[{$type}] {$msg}");
		}
	}
	
	function log($msg){
		echo(date("[".$this->config['core']['time_format'],time())."] $msg\r\n");
	}
	
	function msg($chan,$msg, $skip=false){
		return $this->raw("PRIVMSG $chan $msg", $skip);
	}
}
