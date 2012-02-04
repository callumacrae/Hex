<?php

require './../log.php';

$log = IRCBot_Log::getInstance(null);

var_dump($log);

var_dump($log->debug("testing", "log", "debug", null, IRCBot_Log::TO_DEFAULT | IRCBot_Log::TO_STDOUT));

