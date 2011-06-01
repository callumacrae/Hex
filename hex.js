var IRC = require('./bot'),
	config = require('./config'),
	fs = require('fs'),
	cache, handler, hex, admins = {};

var start = new Date();

cache = fs.readFileSync('./config/cache.json', 'utf8');
cache = JSON.parse(cache);

config.chans = cache.chans;
config.su = cache.su;

eval(fs.readFileSync('./handler.js', 'utf8'));
fs.watchFile('/.handler.js', function()
{
	eval(fs.readFileSync('./handler.js', 'utf8'));
});

hex = new IRC(config)

hex.on(/^:([^!]+)![^@]+@([^ ]+) PRIVMSG ([^ ]+) :(.+)/i, function(info)
{
	var admin, ad_info, flush;
	admin = (admins[info[1]] === undefined) ? 0 : admins[info[1]].level;
	if (admin && info[2] !== admins[info[1]].host)
	{
		console.log('Unauthorised access attempt by ' + info[2] + ' as ' + info[1]);
		return false;
	}

	if (info[3].search('#') !== -1)
	{
		ad_info = /^hex:? (.+)$/i.exec(info[4]);
		if (ad_info)
		{
			info[4] = ad_info[1];
			flush = handler(info, admin);
		}
	}
	else
	{
		ad_info = /^hex:? (.+)$/i.exec(info[4]);
		if (ad_info)
		{
			info[4] = ad_info[1];
		}
		flush = handler(info, admin);
	}

	if (flush)
	{
		flush = JSON.stringify(cache);
		fs.writeFileSync('./config/cache.json', flush, 'utf8');
		fs.readFile('./handler.js', 'utf8', function(err, data)
		{
			if (err)
			{
				console.log(err);
				return;
			}
			eval(data);
		});
	}

	url = /https?:\/{2}([a-zA-Z0-9\-.]+\.[a-zA-Z]{2,5})(\/\S*)?/.exec(info[4])
	if (url)
	{
		url_handler(url, info[3]);
	}

	if (info[3].search('#') !== -1)
	{
		antiflood(info[1], info[3]);
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
	if (config.su[info[1]] === undefined)
	{
		return false;
	}

	if (info[3] === 'JOIN')
	{
		var regex = '^:NickServ![^@]+@[^ ]+ NOTICE [^ ]+ :STATUS ' + info[1] + ' ([0-3])';
		hex.on_once(new RegExp(regex), function(status)
		{
			if (status[1] === '3')
			{
				console.log(info[1] + ' added as admin.');
				admins[info[1]] = {
					host: info[2],
					level: config.su[info[1]]
				}
			}
		});
		hex.msg('NickServ', 'STATUS ' + info[1]);
	}
	else
	{
		delete admins[info[1]];
	}
});

hex.on(/^:([^!]+)![^@]+@[^ ]+ NICK :(.+)$/, function(info)
{
	if (admins[info[1]] !== undefined)
	{
		admins[info[2]] = admins[info[1]];
		delete admins[info[1]];
	}
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
}).on('connected', function()
{
	console.log('Tweet streamer connected.');
}).on('error', function(err)
{
	console.log('Tweet streamer error: ' + err);
});
