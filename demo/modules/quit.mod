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
			'name' => 'Quit',
			'desc' => 'Disconnects and quit.',
			'author' => 'xav0989',
			'version' => '1.0.0',
			'access' => 3,
			'hooks' => array(
				'on_message_received' => 'parse_message',
				'on_private_message_received' => 'parse_private_message',
			),
		);
	}

	public function parse_message ($hook, $data) {
		if ($data['cmd'] == 'quit' || $data['cmd'] == 'shutdown') {
			$this->log->info("Received quit command from {$data['nick']}", 'quit', 'main');
			$this->bot->quit($data['params']);
			return true;
		}
	}

	public function parse_private_message ($hook, $data) {
		$data['chan'] = $data['nick'];
		return $this->parse_message($hook, $data);
	}
}


