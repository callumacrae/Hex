<?php

//simple module to enable quitting

if ($cmd == 'x10bot:' && $subcmd == 'quit') {
	$this->log->info("Received quit command from {$usernick}", 'quit', 'main');
	$this->raw('QUIT');
}

