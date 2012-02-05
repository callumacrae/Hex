<?php

class quit {
	private $bot;
	private $log;

	public function __construct ($bot, $log) {
		$this->bot = $bot;
		$this->log = $log;
	}

	public static function info () {
		return array(
			'name' => 'Quit Module',
			'desc' => 'Disconnects and quit.',
			'author' => 'xav0989',
			'version' => '1.0.0',
			'access' => 3,
			'hooks' => array(
				'on_message_received' => 'parse_message',
			),
		);
	}

	public function parse_message ($hook, $data) {
		if ($data['cmd'] == 'x10bot:' && $data['subcmd'] == 'quit') {
			$this->log->info("Received quit command from {$data['nick']}", 'quit', 'main');
			$this->bot->raw('QUIT');
			return true;
		}
	}
}


