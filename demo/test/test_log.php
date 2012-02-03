<?php

require './../log.php';

$log = IRCBot_Log::getInstance(null);

var_dump($log);

var_dump($log->debug("testing", "log", "debug", null, IRCBot_Log::TO_FILE | IRCBot_Log::TO_STDOUT));

