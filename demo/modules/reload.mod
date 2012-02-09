<?php

class reload {
	private $bot;
	private $log;

	public function __construct ($bot, $log) {
		$this->bot = $bot;
		$this->log = $log;
	}

	public static function info () {
		return array(
			'name' => 'Reload',
			'desc' => 'Pulls the latest version of the bot from the git repository. Any updates to the modules will be instantly updated to the bot.',
			'author' => 'Dead-i & xav0989',
			'version' => '1.0.0',
			'access' => 3,
			'hooks' => array(
				'on_message_received' => 'parse_message',
				'on_private_message_received' => 'parse_private_message',
			),
		);
	}

	public function parse_message ($hook, $data) {
		global $config;
		if ($data['cmd'] == 'reload' || $data['cmd'] == 'restart') {
			$this->log->info("Received reload command from {$data['nick']}", 'reload', 'main');
			exec("cd /home/admin/x10bot;git pull");
			$this->bot->msg($data['chan'], "{$data['nick']}: The bot has been made up-to-date with the GIT repository. Reloading now.");
			$this->bot->change_nick($config['core']['nick'] . '[R]');
			$this->bot->quit("Reload complete");
			die(exec('php ' . join(' ', $GLOBALS['argv'])));
			return true;
		}
	}

	public function parse_private_message ($hook, $data) {
		$data['chan'] = $data['nick'];
		return $this->parse_message($hook, $data);
	}
}

