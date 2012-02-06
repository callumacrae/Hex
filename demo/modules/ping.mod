<?php

class ping {
	private $bot;
	private $log;

	public function __construct ($bot, $log) {
		$this->bot = $bot;
		$this->log = $log;
	}

	public static function info () {
		return array(
			'name' => 'Ping Module',
			'desc' => 'Ping ... Pong.',
			'author' => 'Dead-i & xav0989',
			'version' => '1.0.0',
			'access' => 2,
			'hooks' => array(
				'on_message_received' => 'parse_message',
			),
		);
	}

	public function parse_message ($hook, $data) {
		if ($data['cmd'] == 'ping') {
			$this->log->info("Received ping from {$data['nick']}", 'ping', 'main');
			$this->bot->msg($data['chan'], "{$data['nick']}: pong");
			return true;
		}
	}
}



