<?php

// PING MODULE
// A very simple module which will respond with 'pong' if called.

if ($cmd == 'x10bot:' && $subcmd == 'ping') {
	$this->log->info("Received ping from {$usernick}", 'ping', 'main');
	$this->msg($ex[2], "{$usernick}: pong");
}

