<?php

class mode {
	private $bot;
	private $log;

	public function __construct ($bot, $log) {
		$this->bot = $bot;
		$this->log = $log;
	}

	public static function info () {
		return array(
			'name' => 'Mode',
			'desc' => 'Shortcuts for setting various channel modes.',
			'author' => 'Dead-i',
			'version' => '1.0.0',
			'access' => 2,
			'hooks' => array(
				'on_message_received' => 'parse_message',
				'on_private_message_received' => 'parse_private_message',
			),
		);
	}

	public function parse_message ($hook, $data) {
		if ($data['cmd'] == 'kickban') {
                        if (!empty($data['params'])) {
                                $params = explode(' ', $data['params']);
                                $this->log->info("Received kickban for {$params[1]} from {$data['nick']}", 'mode', 'main');
                                $this->bot->raw("KICK {$data['chan']} {$params[1]} :Your behavior is not conducive to the desired environment. Requested by {$data['nick']}");
                                if ($data['host'] != "x10Hosting.CommunitySupport") {
                                    $this->bot->raw("MODE {$data['chan']} +bb {$data['nick']}!*@* *!*@{$data['host']}");
                                }else{
                                    $this->bot->msg($data['chan'], "{$data['nick']}: You cannot ban a Community Support Representative.");
                                }
                                return true;
                        }else{
                                $this->bot->msg($data['chan'], "{$data['nick']}: You must specify a user to kickban.");
                        }
		}
	}

	public function parse_private_message ($hook, $data) {
		$data['chan'] = $data['nick'];
		return $this->parse_message($hook, $data);
	}
}



