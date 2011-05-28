var IRC = require('./bot'),
	config = require('./config'),
	handle = require('./handler'),
	hex = new IRC(config);

function handler(info)
{
	handle(info, hex);
}

hex.on(/^:([^!]+)![^@]+@[^ ]+ PRIVMSG (#[^ ]+) :hex: (.+)/i, handler);
hex.on(/^:([^!]+)![^@]+@[^ ]+ PRIVMSG ([^# ]+) :(.+)/i, handler);
