<?php

class info {
	private $bot;
	private $log;

	public function __construct ($bot, $log) {
		$this->bot = $bot;
		$this->log = $log;
	}

	public static function info () {
		return array(
			'name' => 'Info Module',
			'desc' => 'Gives out information on the bot and the loaded modules.',
			'author' => 'xav0989',
			'version' => '1.0.0',
			'access' => 1,
			'hooks' => array(
				'on_message_received' => 'parse_message',
			),
		);
	}

	public function parse_message ($hook, $data) {
		if ($data['cmd'] == 'info' || $data['cmd'] == 'about') {
			$this->log->info("Received info from {$data['nick']}", 'info', 'main');
			$info = $this->bot->info();
			$this->bot->msg($data['chan'], "{$data['nick']}: This is who I am:");
			$this->bot->msg($data['chan'], "Core version {$info['core']['version']}");
			foreach ($info['modules'] as $mod) {
				$this->bot->msg($data['chan'], "{$mod['name']} version {$mod['version']}");
			}
			return true;
		}
	}
}



