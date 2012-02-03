<?php

require './../log.php';

$log = IRCBot_Log::getInstance();

var_dump($log);

var_dump($log->debug("testing", "log", "debug", null));

