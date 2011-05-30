var IRC = require('./bot'),
	config = require('./config'),
	handle = require('./handler'),
	fs = require('fs'),
	cache, hex, admins = {};

cache = fs.readFileSync('./cache.json', 'utf8');
cache = JSON.parse(cache);

config.chans = cache.chans;
config.su = cache.su;

hex = new IRC(config)

hex.on(/^:([^!]+)![^@]+@([^ ]+) PRIVMSG ([^ ]+) :(.+)/i, function(info)
{
	var admin, ad_info, flush;
	admin = (admins[info[1]] === undefined) ? 0 : admins[info[1]].level;
	if (admin && info[2] !== admins[info[1]].host)
	{
		console.log([admin, info[2], admins[info[1]].host]);
		console.log('Unauthorised access attempt by ' + info[2] + ' as ' + info[1]);
		return false;
	}

	if (info[3].search('#') !== -1)
	{
		ad_info = /^hex:? (.+)$/.exec(info[4]);
		if (ad_info)
		{
			info[4] = ad_info[1];
			flush = handle(info, hex, admin, config, admins);
		}
	}
	else
	{
		ad_info = /^hex:? (.+)$/.exec(info[4]);
		if (ad_info)
		{
			info[4] = ad_info[1];
		}
		flush = handle(info, hex, admin, config, admins);
	}

	if (flush)
	{
		flush = JSON.stringify(cache);
		fs.writeFileSync('cache.json', flush, 'utf8');
	}
});

hex.on(/^:([^!]+)![^@]+@[^ ]+ KICK (#[^ ]+) ([^ ]+) :/, function(info)
{
	if (info[3] === hex.info.nick)
	{
		console.log('Kicked from ' + info[2] + ' by ' + info[1] + '. Rejoining.');
		hex.join(info[2], function()
		{
			console.log('Successfully rejoined ' + info[2]);
			hex.msg(info[2], info[1] + ': If you want me to go away, please ask a bot admin to remove me using "admin part".');
		});
	}
});

hex.on(/^:([^!]+)![^@]+@([^ ]+) (JOIN|QUIT)/, function(info)
{
	var nick, regex;
	nick = info[1];
	if (config.su[nick] === undefined)
	{
		return false;
	}

	switch (info[3])
	{
		case 'JOIN':
			regex = '^:NickServ![^@]+@[^ ]+ NOTICE [^ ]+ :STATUS ' + nick + ' ([0-3])';
			hex.on_once(new RegExp(regex), function(status)
			{
				if (status[1] === '3')
				{
					console.log(nick + ' added as admin.');
					admins[nick] = {
						host: info[2],
						level: config.su[info[1]]
					}
				}
			});
			hex.msg('NickServ', 'STATUS ' + nick);
			break;

		case 'QUIT':
			delete admins[nick];
			break;
	}
});

hex.on(/^:([^!]+)![^@]+@[^ ]+ NICK :(.+)$/, function(info)
{
	var new_nick, nick;
	nick = info[1];
	new_nick = info[2];
	if (admins[nick] === undefined)
	{
		return false;
	}

	admins[new_nick] = admins[nick];
	delete admins[nick];
});

var Twitter = require('./twitter');
var twit = new Twitter({
	user: config.twitter.user,
	pass: config.twitter.pass
}, 'follow=43312221');

twit.on('tweet', function(tweet)
{
	//remember to change this to #x10hosting -__-
	hex.msg('#cjasdklj', 'New tweet from @x10hosting: ' + tweet)
});

twit.on('connected', function()
{
	console.log('Tweet streamer connected.');
});

twit.on('error', function(err)
{
	console.log('Tweet streamer error: ' + err);
});
