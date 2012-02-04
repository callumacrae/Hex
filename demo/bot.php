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

		//load the modules
		//run pre_on_connect

		$this->log->info("Connecting to server", "core", "connect");
		$this->log->debug("server:$serverdetails[0], port:$serverdetails[1]", "core", "connect");
		if (!$this->sock = fsockopen($serverdetails[0], $serverdetails[1])) {
			$this->log->error("Failed to gain a connection", "core", 'connect', null, IRCBot_Log::TO_FILE | IRCBot_Log::TO_EMAIL | IRCBot_Log::TO_STDOUT);
			die(1);
		}

		$this->raw("NICK {$this->config['core']['nick']}");
		$this->raw("USER {$this->config['core']['nick']} {$this->config['core']['nick']} {$this->config['core']['nick']} :{$this->config['core']['nick']}");
		
		//run post_on_connect

		$this->main();
	}

	function main(){
		while (!feof($this->sock)) {
			$data = trim(fgets($this->sock));

			if ($data == "") {
				continue;
			}
			
			$this->log->debug($data, "core", "received");

			$ex = explode(" ",$data);

			if (isset($ex[1]) && $ex[1] == "001") { //Checks for code sent by IRC saying that a connection has been made
				//run pre_identify
				$this->msg("NickServ","IDENTIFY {$this->config['core']['nickserv']}");
				//run post_identify
				//run pre_join
				$this->raw("JOIN {$this->config['core']['channels']}");
				//run post_join
				continue;
			}

			if ($ex[0] == "PING") {
				//run pre_ping
				$this->raw("PONG {$ex[1]}", true);
				//run post_ping
				continue;
			}

			if (isset($ex[2])) {
				$chan = $ex[2];
				$chanl = strtolower($chan);
			}

			$cmd = substr($ex[3],1); //Trim : from the begining
			$cmdl = strtolower($cmd);
			$subcmd = $ex[4];
			$subcmdl = strtolower($subcmd);

			//run on_message_received

			//while this is technically okay, it will make the ram usage rocket!
			//also it limits the possibilities for complex modules
			$modules = glob("./modules/*.mod");
			foreach($modules as $module){
				if (!include($module)) { //This should not be include_once to allow dynamic module editing.
					if($this->modulewarning[$module] != true){
						$this->log->error("{$module} module could not be loaded", "core", "loader");
						$this->modulewarning[$module] = true;
					}
				}else{
					$this->modulewarning[$module] = false;
				}
				//TODO implement as demo/README
			}
		}

		$this->log->error("No longer connected.", "core", "IRCBot", null, IRCBot_Log::TO_FILE | IRCBot_Log::TO_STDOUT | IRCBot_Log::TO_EMAIL);
		die(1);
	}
	
	function raw($msg, $skip=false){
		if (!$skip) {
			$this->log->debug("Sending message to server \"{$msg}\"", "core", "raw");
			//run pre_on_message_send
		}

		if (fputs($this->sock, $msg."\r\n") !== false) {
			//run post_on_message_send
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
	
	function msg($chan,$msg, $skip=false){
		return $this->raw("PRIVMSG $chan :$msg", $skip);
	}
}
