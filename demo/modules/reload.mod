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
			'name' => 'Reload Module',
			'desc' => 'Pulls the latest version of the bot from the git repository. Any updates to the modules will be instantly updated to the bot.',
			'author' => 'Dead-i & xav0989',
			'version' => '1.0.0',
			'access' => 3,
			'hooks' => array(
				'on_message_received' => 'parse_message',
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
			exec("nohup php run.php > out.txt &");
			//will add status check here
			$this->bot->quit("Reload complete");
			return true;
		}


	}
}

