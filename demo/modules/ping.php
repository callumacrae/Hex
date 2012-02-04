<?php

// PING MODULE
// A very simple module which will respond with 'pong' if called.

if ($cmdl == 'x10bot:' && $subcmdl == 'ping') {
    $this->msg($ex[2], "{$usernick}: Pong");
}

?>