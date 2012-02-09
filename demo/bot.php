<?php
require_once 'config.php';
require_once 'log.php';

class IRCBot{
	private $config = array();
	private $sock;
	private $modulewarning = array();
	private $log;

	private $channels = array();
	private $nick;
	private $identified = false;

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
		'on_private_message_received',
		'pre_on_message_send',
		'post_on_message_send',
		'pre_nick_change',
		'post_nick_change',
		'pre_channel_join',
		'post_channel_join',
		'pre_quit',
		'post_quit',
	);
	private $modules;
	private $modules_info;
	private $modules_hook;

	public function __construct () {
		global $config;

		$this->config = $config;
		$this->log = IRCBot_Log::getInstance($this);

		//load the modules
		$this->load_modules();
		if (!$this->run_hook('pre_on_connect')) {
			return;
		}

		$this->log->info("Connecting to server {$this->config['core']['server']}:{$this->config['core']['port']}", "core", "connect");
		$this->log->debug("server:{$this->config['core']['server']}, port:{$this->config['core']['port']}", "core", "connect");
		if (!$this->sock = fsockopen($this->config['core']['server'], $this->config['core']['port'])) {
			$this->log->error("Failed to gains a connection", "core", 'connect');
			return;
		}
		if (isset($this->config['core']['serverpass']) && !empty($this->config['core']['serverpass'])) {
			$this->raw("PASS {$this->config['core']['serverpass']}", false, true);
		}
		$this->change_nick($this->config['core']['nick']);
		$this->raw("USER {$this->config['core']['nick']} {$this->config['core']['nick']} {$this->config['core']['nick']} :{$this->config['core']['name']}");

		$this->run_hook('post_on_connect');

		$this->main();
	}

	public function main () {
		while (!feof($this->sock)) {
			$data = trim(fgets($this->sock));

			if ($data == "") {
				continue;
			}

			if (preg_match('/^PING :(.*)$/', $data, $matches)) {
				if (!$this->run_hook('pre_ping')) {
					continue;
				}
					$this->raw("PONG :{$matches[1]}", true);
					$this->run_hook('post_ping');

					continue;
			}

			$this->log->irc_log($data, IRCBot_Log::TO_FILE | IRCBot_LOG::TO_STDOUT);

			if (!$this->is_identified()) {
				if (strpos($data, '001') == (strlen($this->config['core']['server'])+2)) { //Checks for code sent by IRC saying that a connection has been made
					$this->log->info("Identifying as {$this->config['core']['nick']}", 'core', 'identify');
					if (!$this->run_hook('pre_identify')) {
						continue;
					}
					$this->msg("NickServ","IDENTIFY {$this->config['core']['nickserv']}");
					$this->run_hook('post_identify');

					continue;
				}

				if (strpos($data, '900') == (strlen($this->config['core']['server'])+2)) { //checks for code send by nickserv that we are identified
					$this->log->info("Identified as {$this->nick}", 'core', 'identify');
					$this->log->info("Joining initial channels", 'core', 'join');
					if (!$this->run_hook('pre_join')) {
						continue;
					}
					foreach (explode(',', $this->config['core']['channels']) as $channel) {
						$this->join($channel);
					}
					$this->run_hook('post_join');

					$this->identified = true;

					continue;
				}
			}

			if (preg_match('/^:(.*)!(.*)@(.*) PRIVMSG #(.*) :([.\S]*) ([.\S]*)(?: (.*))?$/', $data, $matches)) {
				if (str_replace(array(':', ',', '.', '/', '<', '>', '?', ';', '\'', '\\', ':', '\"', '|', '[', '{', ']', '}', '!', '@', '£', '$', '%', '^', '&', '*', '\(', '\)', '-', '_', '=', '+'), '', $matches[5]) != $this->config['core']['command_word']) {
					var_dump(str_replace(array(':', ',', '.', '/', '<', '>', '?', ';', '\'', '\\', ':', '\"', '|', '[', '{', ']', '}', '!', '@', '£', '$', '%', '^', '&', '*', '\(', '\)', '-', '_', '=', '+'), '', $matches[5]));
					continue;
				}
				
				$hook_data = array(
					'raw' => $data,
					'params' => '',
					'nick' => $matches[1],
					'host' => $matches[3],
					'chan' => '#' . $matches[4],
					'cmd' => $matches[6],
				);

				if (isset($matches[7])) {
					$hook_data['params'] = $matches[7];
				}
	
				//run on_message_received
				$this->run_hook('on_message_received', $hook_data);

				continue;
			}

			if (preg_match('/^:(.*)!(.*)@(.*) PRIVMSG ([^#].*) :([.\S]*)(?: (.*))?$/', $data, $matches)) {
				if (empty($matches[5])) {
					continue;
				}

				$hook_data = array(
					'raw' => $data,
					'params' => '',
					'nick' => $matches[1],
					'host' => $matches[3],
					'cmd' => $matches[5],
				);

				if (isset($matches[6])) {
					$hook_data['params'] = $matches[6];
				}
	
				//run on_message_received
				$this->run_hook('on_private_message_received', $hook_data);

				continue;
			}
		}

		$this->log->error("No longer connected.", "core", "IRCBot", null, IRCBot_Log::TO_FILE | IRCBot_Log::TO_STDOUT | IRCBot_Log::TO_EMAIL);
	}

	public function is_identified () {
		return $this->identified;
	}

	public function info() {
		return array(
			'core' => array(
				'version' => $this->config['core']['version'],
			),
			'modules' => $this->modules_info,
		);
	}
	
	public function raw ($msg, $skip=false, $silence = false) {
		if ($skip) {
			if (is_resource($this->sock)) {
				fputs($this->sock, $msg."\r\n");
			}
			return true;
		}

		if (!$silence) {
			$this->log->debug("Sending message to server \"{$msg}\"", "core", "raw");
		}
		$this->run_hook('pre_on_message_send', $msg);
		
		if (!is_resource($this->sock)) {
			if (!$silence) {
				$this->log->error("No connection. Could not send message: \'$msg\'", 'core', 'raw');
			}
			return false;
		}

		if (fputs($this->sock, $msg."\r\n") !== false) {
			$this->run_hook('post_on_message_send', $msg);
			return true;
		}

		$this->log->error("There was a problem sending: \'$msg\'", 'core', 'raw');
		return false;
	}
	
	public function msg ($chan, $msg, $skip=false) {
		return $this->raw("PRIVMSG $chan :$msg", $skip);
	}

	public function change_nick ($new) {
		if (!$this->run_hook('pre_nick_change', $new)) {
			return false;
		}
		$this->log->info("Changing nick", 'core', 'change_nick');
		$this->log->debug("New nick: $new", 'core', 'change_nick');
		$return = $this->raw("NICK $new", false, true);
		$this->run_hook('post_nick_change', $new);
		if ($return) {
			$this->nick = $new;
		}
		return $return;
	}

	public function join ($channel) {
		if (in_array($channel, $this->channels)) {
			$this->log->info("Already in channel $channel", 'core', 'join');
		}
		
		if (!$this->run_hook('pre_channel_join', $channel)) {
			return false;
		}
		$this->log->info("Joining channel $channel", 'core', 'join');
		$return = $this->raw("JOIN $channel", false, true);
		$this->run_hook('post_channel_join', $channel);
		if ($return) {
			$this->channel[] = $channel;
		}
		return $return;
	}

	public function quit ($msg = '') {
		if (!$this->run_hook('pre_quit', $msg)) {
			return false;
		}
		$this->log->info("Quitting", 'core', 'quit');
		$this->log->debug("Quit message: $msg", 'core', 'quit');
		$return = $this->raw("QUIT $msg",  false, true);
		$this->run_hook('post_quit', $msg);
		return $return;
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

	private function run_hook ($hook, $args = array()) {
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

