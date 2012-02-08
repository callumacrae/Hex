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
			'name' => 'Info',
			'desc' => 'Gives out information on the bot and the loaded modules.',
			'author' => 'xav0989',
			'version' => '1.0.0',
			'access' => 1,
			'hooks' => array(
				'on_message_received' => 'parse_message',
				'on_private_message_received' => 'parse_message',
			),
		);
	}

	public function parse_message ($hook, $data) {
		if ($data['cmd'] == 'info' || $data['cmd'] == 'about') {
			$this->log->info("Received info from {$data['nick']}", 'info', 'main');
			$info = $this->bot->info();
			if (empty($data['params'])) {
				$this->bot->msg($data['chan'], "{$data['nick']}: This is who I am:");
				$this->bot->msg($data['chan'], "Core version {$info['core']['version']}");
				if (count($info['modules']) == 0) {
					$this->bot->msg($data['chan'], "There are no modules loaded");
				} else {
					foreach ($info['modules'] as $id => $mod) {
						$mods .= "{$mod['name']}($id), ";
					}
					$mods = trim(trim($mods), ',');
					$this->bot->msg($data['chan'], "The following module(s) (is|are) loaded: $mods.");
				}
			} else {
				$mods = explode(' ', $data['params']);
				foreach ($mods as $mod) {
					if (!array_key_exists($mod, $info['modules'])) {
						$this->log->warn("Unknown module named $mod", 'info', 'specifics');
						continue;
					}
					$this->bot->msg($data['chan'], "{$data['nick']}: Module {$info['modules'][$mod]['name']} by {$info['modules'][$mod]['author']} version {$info['modules'][$mod]['version']}. Description: {$info['modules'][$mod]['desc']}");
				}
			}
			return true;
		}
	}
}



