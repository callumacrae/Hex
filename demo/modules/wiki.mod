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
			/*
			 * Pull from Hex, to be converted	
var options = {
host: 'x10hosting.com',
port: 80,
path: '/wiki/index.php?title=Special%3ASearch&search=' + encodeURIComponent(cmd_end),
method: 'GET'
};

var req = http.request(options, function (res) {
if (res.statusCode === 302 || res.statusCode === 301) {
var url = res.headers.location
} else {
var url = 'http://x10hosting.com/wiki/index.php?title=Special%3ASearch&search=' + encodeURIComponent(cmd_end);
}
});			
			 */
			$data['params'] = trim($data['subcmd'] . ' ' . $data['params']);
			if (empty($data['params'])) {
				$this->log->warn('Calling wiki without a query', 'wiki', 'parse');
			}
			return true;
		}
	}
}



