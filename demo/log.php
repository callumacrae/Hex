<?php

require_once 'config.php';

class IRCBot_Log {

	const TO_FILE = 1;
	const TO_CHANNEL = 2;
	const TO_MEMO = 4;
	const TO_EMAIL = 8;

	const DEBUG = 1;
	const INFO = 2;
	const WARN = 3;
	const ERROR = 4;

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
			return $this->_log_file($config['irclog']['file_location'], $data);
			break;
		default:
			//generate an exception
			break;
		}
	}

	public function debug ($text, $module, $location, $trace, $options=null) {
		return $this->bot_log(self::DEBUG, $text, $module, $location, $trace, $options);
	}

	public function info ($text, $module, $location, $trace, $options=null) {
		return $this->bot_log(self::INFO, $text, $module, $location, $trace, $options);
	}

	public function warn ($text, $module, $location, $trace, $options=null) {
		return $this->bot_log(self::WARN, $text, $module, $location, $trace, $options);
	}

	public function error ($text, $module, $location, $trace, $options=null) {
		return $this->bot_log(self::ERROR, $text, $module, $location, $trace, $options);
	}

	public function bot_log ($level, $text, $module, $location, $trace, $options=null) {
		$time = date(DATE_COOKIE);
		$name = $this->_level_name($level);

		$result = 0;

		if ($options === null) {
			$options = $this->_default_options($level);
		}

		if (($options & self::TO_FILE) == self::TO_FILE) {
			switch ($config['irclog']['format']) {
			case 'plaintext':
			case 'text':
				$data = sprintf($config['botlog']['line_format'], $time, $name, $module, $location, $text, $trace);
				if ($this->_log_file($config['botlog']['file_location'], $data)) {
					$results |= self::TO_FILE;
				}
				break;
			default:
				//generate an exception
				break;
			}
		}

		if (($options & self::TO_CHANNEL) == self::TO_CHANNEL) {
			$data = sprintf($config['botlog']['channel_format'], $time, $name, $module, $location, $text, $trace);
			if ($this->_log_channel($config['botlog']['channel_location'], $data)) {
				$results |= self::TO_CHANNEL;
			}
		}

		if (($options & self::TO_MEMOL) == self::TO_MEMO) {
			$user = array();
			//create an array of admin's IRC handle.

			$data = sprintf($config['botlog']['memo_format'], $time, $name, $module, $location, $text, $trace);
			if ($this->_log_memo($user, $data)) {
				$results |= self::TO_MEMO;
			}
		}

		if (($options & self::TO_EMAIL) == self::TO_EMAIL) {
			$email = array();
			//create an array of admin's email

			$data['subject'] = sprintf($config['botlog']['email_subject_format'], $time, $name, $module, $location, $text, $trace);
			$data['body'] = sprintf($config['botlog']['email_body_format'], $time, $name, $module, $location, $text, $trace);
			if ($this->_log_email($email, $data)) {
				$results |= self::TO_EMAIL;
			}
		}


		if ($results == $options) {
			return true;
		}

		//generate exception
		return false;
	}

	private function _default_options($level) {
		global $config;

		$options = 0;

		if ($config['botlog']['file_level'] <= $level) {
			$options |= self::TO_FILE;
		}
		if ($config['botlog']['channel_level'] <= $level) {
			$options |= self::TO_CHANNEL;
		}
		if ($config['botlog']['memo_level'] <= $level) {
			$options |= self::TO_MEMO;
		}
		if ($config['botlog']['email_level'] <= $level) {
			$options |= self::TO_EMAIL;
		}

		return $options;
	}

	private function _level_name($level) {
		switch ($level) {
		case self::DEBUG:
			return 'DEBUG';
		case self::INFO:
			return 'INFO';
		case self::WARN:
			return 'WARN';
		case self::ERROR:
			return 'ERROR';
		default:
			//generate exception
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
		//check presence of library file
		//check presence of table. Create if not there
		//add data to table. The data is an array
	}

	private function _log_channel($channel, $data) {
		//using core, send message to the channel
	}

	private function _log_memo($user, $data) {
		//if $user is an array, call _log_memo for each member (recursive)
		//using core, send privmsg to memoserv "SEND $user $data"
	}

	private function _log_email($email, $data) {
		//if $email is an array, call _log_email for each member (recursive)
		//using email, send email to $email
	}

}
