<?php

require_once 'config.php'

class IRCBot_Log {

	private static $instance;

	private function __construct() { 
	}

	public static function getInstance() {
		if (!isset(self::$instance)) {
			$className = __CLASS__;
			self::$instance = new $className;
		}
		return self::$instance;
	}

	public function irc_log($line) {
		global $config;

		$default_line = array(
			'time' => '',
			'channel' => '',
			'user' => '',
			'text' => '',
		);

		$line = array_merge($default_line, $line);

		switch ($config['irclog']['format']) {
		case 'plaintext':
		case 'text':
			$data = sprintf($config['irclog']['line_format'], $line['time'], $line['channel'], $line['user'], $line['text']);
			return _log_file($config['irclog']['file'], $data);
			break;
		default:
			//generate an exception
			break;
		}
	}

	private function _log_file($file, $data) {
		if (!is_writable($file)) {
			//generate exception
			return false;
		}
		return file_put_contents($file, $data . "\n", FILE_APPEND);
	}

	private function _log_sqlite($table, $data) {
	}

	private function _log_channel($channel, $data) {
	}

	private function _log_memo($user, $data) {
	}

	private function _log_email($email, $data) {
	}

}

