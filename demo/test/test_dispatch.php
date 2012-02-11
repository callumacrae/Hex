<?php

$lines['connect'] = ':irc.x10hosting.com 001 x10bot[demo] :Welcome to the x10IRC IRC Network x10bot[demo]!x10bot[demo]@toxic-productions.com';
$lines['login'] = ':irc.x10hosting.com 900 x10bot[demo] x10bot[demo]!x10bot[demo]@x10IRC\user-ba8.g5m.7u6lih.IP x10Bot[demo] :You are now logged in as x10Bot[demo]';
$lines['no command'] = ':Dead-i!Dead-i@x10Hosting.CommunitySupport PRIVMSG #x10bot :x10bot';
$lines['no param'] = ':xav0989[web]!Mibbit@x10Hosting.CommunitySupport PRIVMSG #x10bot :x10bot news';
$lines['param'] = ':Dead-i!Dead-i@x10Hosting.CommunitySupport PRIVMSG #x10bot :x10bot news set testing testing I\'m just suggesting';
$lines['priv no command'] = ':Dead-i!Dead-i@x10Hosting.CommunitySupport PRIVMSG x10bot[demo] :';
$lines['priv no param'] = ':xav0989[web]!Mibbit@x10Hosting.CommunitySupport PRIVMSG x10bot[demo] :news';
$lines['priv param'] = ':Dead-i!Dead-i@x10Hosting.CommunitySupport PRIVMSG x10bot[demo] :news set testing testing I\'m just suggesting';


echo '001';
var_dump(strpos($lines['connect'], '001'), strlen("irc.x10hosting.com")+2);

echo '900';
var_dump(strpos($lines['login'], '900'), strlen("irc.x10hosting.com")+2);

echo 'CHANNEL MESSAGE NO COMMAND';
var_dump(preg_match('/^:(.*)!(.*)@(.*) PRIVMSG #(.*) :([.\S]*) ([.\S]*)(?: (.*))?$/', $lines['no command'], $matchesnc), $matchesnc);

echo 'CHANNEL MESSAGE NO PARAM';
var_dump(preg_match('/^:(.*)!(.*)@(.*) PRIVMSG #(.*) :([.\S]*) ([.\S]*)(?: (.*))?$/', $lines['no param'], $matchesnp), $matchesnp);

echo 'CHANNEL MESSAGE PARAM';
var_dump(preg_match('/^:(.*)!(.*)@(.*) PRIVMSG #(.*) :([.\S]*) ([.\S]*)(?: (.*))?$/', $lines['param'], $matchesp), $matchesp);

echo 'PRIVATE MESSAGE NO COMMAND';
var_dump(preg_match('/^:(.*)!(.*)@(.*) PRIVMSG ([^#].*) :([.\S]*)(?: (.*))?$/', $lines['priv no command'], $matchespnc), $matchespnc);

echo 'PRIVATE MESSAGE NO PARAM';
var_dump(preg_match('/^:(.*)!(.*)@(.*) PRIVMSG ([^#].*) :([.\S]*)(?: (.*))?$/', $lines['priv no param'], $matchespnp), $matchespnp);

echo 'PRIVATE MESSAGE PARAM';
var_dump(preg_match('/^:(.*)!(.*)@(.*) PRIVMSG ([^#].*) :([.\S]*)(?: (.*))?$/', $lines['priv param'], $matchespp), $matchespp);

