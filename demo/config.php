<?php
$config['core'] = array(
	'server' => 'irc.x10hosting.com:6667',
	'channels' => '#x10bot,#x10bot-backend',
	'nickserv' => '',
	'serverpass' => '',
	'date' => 'Europe/London',
	'debug' => true,
	'debugchan' => '#x10bot-backend1',
);
$config['irclog'] = array(
	'file_location' => './irc.log',
	'format' => 'plaintext',
	'line_format' => '[%1$s] #%2$s - %3$s - %4$s', // order of parameters: time, channel, user, text
);
$config['botlog'] = array(
	'file_location' => './bot.log',
	'format' => 'plaintext',
	'line_format' => '[%1$s] #%2$s - %3$s', // order of parameters: time, level, text, trace
	'channel_format' => '[%1$s] #%2$s - %3$s', // order of parameters: time, level, text, trace
	'memo_format' => '[%1$s] #%2$s - %3$s', // order of parameters: time, level, text, trace
	'email_format' => 'At %1$s \n\n There was a #%2$s level message logged. Here are the details: \t%3$s \n\n Trace: %4$s', // order of parameters: time, level, text, trace
	'email_subject' => 'x10bot - %2$1 level message', // order of parameters: time, level, text, trace
	'channel_level' => 'debug',
	'memo_level' => 'error',
	'email_level' => 'error',
);
$config['email'] = array(
);
