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
			$this->raw("NICK {$this->config['nick']}");
			$this->raw("USER {$this->config['nick']} {$this->config['nick']} {$this->config['nick']} :{$this->config['nick']}");
			$this->main();
		}
		function main(){
			$data = trim(fgets($this->sock));
			if($data != ""){
				$this->log($msg);
			}
			$ex = explode(" ",$data);
			if($ex[1] == "001"){ //Checks for code sent by IRC saying that a connection has been made
				$this->msg("NickServ","IDENTIFY {$this->config['nickserv']}");
				$this->raw("JOIN {$this->config['chans']}");
			}
			if($ex[0] == "PING"){
				$this->raw("PONG {$ex[1]}");
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
				log("[{$type}] {$msg}");
			}
		}
		
		function log($msg){
			
		}
		
		function msg($chan,$msg){
			$this->raw("PRIVMSG $chan $msg");
		}
	}
?>