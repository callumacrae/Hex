<?php
require_once 'config.php';
require_once 'log.php';

class IRCBot{
	private $config = array();
	private $sock;
	private $modulewarning = array();
	private $log;

	private $hooks = array(
		'pre_on_connect',
		'post_on_connect',
		'pre_identify',
		'post_identify',
		'pre_join',
		'post_join',
		'pre_ping',
		'post_ping',
		'on_message_received',
		'pre_on_message_send',
		'post_on_message_send',
	);
	private $modules;
	private $modules_info;
	private $modules_hook;

	public function __construct () {
		global $config;

		$this->config = $config;
		$this->log = IRCBot_Log::getInstance($this);
		$serverdetails = explode(":",$this->config['core']['server']);

		//load the modules
		$this->load_modules();
		//run pre_on_connect

		$this->log->info("Connecting to server {$serverdetails[0]}:{$serverdetails[1]}", "core", "connect", null, IRCBot_Log::TO_FILE | IRCBot_Log::TO_STDOUT);
		$this->log->debug("server:$serverdetails[0], port:$serverdetails[1]", "core", "connect", null, IRCBot_Log::TO_FILE);
		if (!$this->sock = fsockopen($serverdetails[0], $serverdetails[1])) {
			$this->log->error("Failed to gain a connection", "core", 'connect', null, IRCBot_Log::TO_FILE | IRCBot_Log::TO_EMAIL | IRCBot_Log::TO_STDOUT);
			die(1);
		}
		$this->raw("NICK {$this->config['core']['nick']}");
		$this->raw("USER {$this->config['core']['nick']} {$this->config['core']['nick']} {$this->config['core']['nick']} :{$this->config['core']['nick']}");

		//run post_on_connect

		$this->main();
	}

	public function main () {
		while (!feof($this->sock)) {
			$data = trim(fgets($this->sock));

			if ($data == "") {
				continue;
			}

			$ex = explode(" ", $data);

			if ($ex[0] == "PING") {
				//run pre_ping
				$this->raw("PONG {$ex[1]}", true);
				//run post_ping

				continue;
			}

			$this->log->irc_log($data, IRCBot_Log::TO_FILE | IRCBot_LOG::TO_STDOUT);

			if ($ex[1] == "001") { //Checks for code sent by IRC saying that a connection has been made
				$this->log->info("Identifying as {$this->config['core']['nick']}", 'core', 'identify');
				//run pre_identify
				$this->msg("NickServ","IDENTIFY {$this->config['core']['nickserv']}");
				//run post_identify

				$this->log->info("Joining {$this->config['core']['channels']}", 'core', 'join');
				//run pre_join
				$this->raw("JOIN {$this->config['core']['channels']}");
				//run post_join

				continue;
			}

			//FIXME DO we need both lowercase and whatever for the bot? I say only whatever case
			
			$hook_data = array(
				'raw' => $data,
				'ex' => $ex,
				'chan' => '',
				'cmd' => '',
				'subcmd' => '',
				'nick' => '',
				'host' => '',
			);

			if (isset($ex[2])) {
				$hook_data['chan'] = $ex[2];
			}

			if (isset($ex[3])) {
				$hook_data['cmd'] = strtolower(substr($ex[3], 1)); //Trim : from the begining
			}
			if (isset($ex[4])) {
				//the following would enable us to do multiple
				/*
				$i = 4;
				do {
					var_dump($ex[$i]);
					$hook_data['subcmd'] += strtolower($ex[$i]) . ' ';
					$i++;
				} while ($i < count($ex));
				var_dump($hook_data['subcmd'], $ex);
*/
				$hook_data['subcmd'] = trim(strtolower($ex[4]));
			}

			$user = explode("!", $ex[0]);
			if (isset($user[1])) {
				$hook_data['nick'] = substr($user[0], 1);

				$host = explode("@", $user[1]);
				$hook_data['host'] = $host[1];
			}

			//run on_message_received
			$this->run_hook('on_message_received', $hook_data);

			//changing to the hook-type module/plugin system
			//while this is technically okay, it will make the ram usage rocket!
			//also it limits the possibilities for complex modules
			/*$modules = glob("./modules/*.mod");
			foreach($modules as $module){
				if (!include($module)) { //This should not be include_once to allow dynamic module editing.
					if($this->modulewarning[$module] != true){
						$this->log->error("{$module} module could not be loaded", "core", "loader");
						$this->modulewarning[$module] = true;
					}
				}else{
					$this->modulewarning[$module] = false;
				}
				//TODO implement as demo/README sets out
			}*/
		}

		$this->log->error("No longer connected.", "core", "IRCBot", null, IRCBot_Log::TO_FILE | IRCBot_Log::TO_STDOUT | IRCBot_Log::TO_EMAIL);
	}
	
	public function raw ($msg, $skip=false) {
		if (!$skip) {
			$this->log->debug("Sending message to server \"{$msg}\"", "core", "raw");
			//run pre_on_message_send
		}

		if (!is_resource($this->sock)) {
			if ($skip) {
				return true;
			}
			$this->log->error("No connection. Could not send message: \'$msg\'", 'core', 'raw');
			return false;
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
	
	public function msg ($chan, $msg, $skip=false) {
		return $this->raw("PRIVMSG $chan :$msg", $skip);
	}

	private function load_modules () {
		$this->log->info('Loading modules', 'core', 'modules_load');
		$modules = glob("./modules/*.mod");
		sort($modules);
		foreach($modules as $module){
			$bn = basename($module, ".mod");
			$this->log->debug("Loading module $bn", 'core', 'modules_load');

			if ((include $module) === false) {
				$this->log->error("$bn module could not be loaded", "core", "modules_load");
				continue;
			}

			$info = call_user_func(array($bn, 'info'));

			foreach ($info['hooks'] as $hook => $function) {
				if (!$this->register_hook($hook, $bn, $function)) {
					$this->log->error("Could not register $hook in module $bn", "core", "modules_load_register");
					continue;
				}
			}

			$this->modules[$bn] = new $bn($this, $this->log);
			$this->modules_info[$bn] = $info;
		}
	}

	private function register_hook ($hook, $module, $function) {
		if (!in_array($hook, $this->hooks)) {
			$this->log->error("Unknown hook $hook in module $module", 'core', 'register_hook');
			return false;
		}
		$this->log->debug("Hooking $function to $hook in module $module", 'core', 'register_hook');
		$this->modules_hook[$hook][$module] = $function;
		return true;
	}

	private function run_hook ($hook, $args) {
		if (!in_array($hook, $this->hooks)) {
			$this->log->error("Unknown hook $hook", 'core', 'run_hook');
			return false;
		}

		if (!array_key_exists($hook, $this->modules_hook)) {
			//$this->log->debug("No hook registered for $hook", 'core', 'run_hook', null, IRCBot_Log::TO_FILE | IRCBot_Log::TO_STDOUT);
			return true;
		}

		$results = true;

		foreach ($this->modules_hook[$hook] as $module => $function) {
			$temp = $this->modules[$module]->$function($hook, $args);
			if ($results && !$temp) {
				$results = false;
			}
		}

		return $results;
	}

	private function unload_modules () {
		//
	}

	public function reload_modules () {
		$this->unload_modules();
		$this->load_modules();
		return true;
	}
}

