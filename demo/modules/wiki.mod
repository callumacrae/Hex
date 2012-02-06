<?php

class wiki {
	private $bot;
	private $log;

	public function __construct ($bot, $log) {
		$this->bot = $bot;
		$this->log = $log;
	}

	public static function info () {
		return array(
			'name' => 'WIKI Module',
			'desc' => 'Searches on the wiki.',
			'author' => 'xav0989',
			'version' => '1.0.0',
			'access' => 1,
			'hooks' => array(
				'on_message_received' => 'parse_message',
			),
		);
	}

	public function parse_message ($hook, $data) {
		if ($data['cmd'] == 'wiki') {
			return true;
		}
	}
}



