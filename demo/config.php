<?php
$config['core'] = array(
	"server" => "irc.x10hosting.com:6667",
	"channels" => "#x10bot,#x10bot-backend",
	"nickserv" => "",
	"serverpass" => "",
	"date" => "Europe/London",
	"debug" => true,
	"debugchan" => "#x10bot-backend",
);
$config['irclog'] = array(
	"file_location" => "./irc.log",
	"format" => "plaintext",
);
$config['botlog'] = array(
	"file_location" => "./bot.log",
	"format" => "plaintext",
	"channel_level" => "debug",
	"memo_level" => "error",
	"email_level" => "error",
);