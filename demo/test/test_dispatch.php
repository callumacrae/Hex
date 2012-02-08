<?php

$lines['connect'] = ':irc.x10hosting.com 001 x10bot[demo] :Welcome to the x10IRC IRC Network x10bot[demo]!x10bot[demo]@toxic-productions.com';
$lines['login'] = ':irc.x10hosting.com 900 x10bot[demo] x10bot[demo]!x10bot[demo]@x10IRC\user-ba8.g5m.7u6lih.IP x10Bot[demo] :You are now logged in as x10Bot[demo]';

echo '001';
var_dump(strpos($lines['connect'], '001'), strlen("irc.x10hosting.com")+2);

echo '900';
var_dump(strpos($lines['login'], '900'), strlen("irc.x10hosting.com")+2);

