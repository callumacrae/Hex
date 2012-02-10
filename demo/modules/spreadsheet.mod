<?php

class spreadsheet {
	private $bot;
	private $log;

	public function __construct ($bot, $log) {
		$this->bot = $bot;
		$this->log = $log;
	}

	public static function info () {
		return array(
			'name' => 'Spreadsheet',
			'desc' => 'Gives the user the URL to the spreadsheet.',
			'author' => 'GtoXic',
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
		if ($data['cmd'] == 'spreadsheet') {
			$this->log->info("Received spreadsheet command from {$data['nick']}", 'spreadsheet', 'main');
			$this->bot->msg($data['chan'], "{$data['nick']}: http://tinyurl.com/x10botspreadsheet");
			return true;
		}
	}

	public function parse_private_message ($hook, $data) {
		$data['chan'] = $data['nick'];
		return $this->parse_message($hook, $data);
	}
}

