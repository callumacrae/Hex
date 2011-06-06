var IRC = require('bot'),
	config = require('../config'),
	hex, handler, admins = {};

config.user = config.user_game;
config.chans = ['#games'];

eval(fs.readFileSync('./handler.js', 'utf8'));

hex = new IRC(config);

hex.on(/^:([^!]+)![^@]+@[^ ]+ PRIVMSG ([^ ]+) :(.+)$/i, function(info)
{
	var re = handle(info);
	if (re === 'FLUSH')
	{
		eval(fs.readFileSync('./handler.js', 'utf8'));
	}
});