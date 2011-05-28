var net = require('net'),
	config = require('./config'),
	irc = {};
irc.info = {};
irc.info.names = {};

irc.socket = new net.Socket();

irc.socket.on('data', function(data)
{
	data = data.split('\n');
	for (var i = 0; i < data.length; i++)
	{
		console.log('RECV -', data[i]);
		if (data !== '')
		{
			irc.handle(data[i].slice(0, -1));
		}
	}
});
irc.socket.on('error', function(exception)
{
	console.log('error:', exception);
});

irc.socket.on('connect', function()
{
	console.log('Established connection, registering and shit...');
	irc.on(/^PING :(.+)$/i, function(info)
	{
		irc.raw('PONG :' + info[1]);
	});
	irc.on(/^[^ ]+ 001 ([0-9a-zA-Z\[\]\\`_\^{|}\-]+) :/, function(info)
	{
		irc.info.nick = info[1];
	});
	irc.on(/^:([^!]+)![^@]+@[^ ]+ NICK :(.+)$/, function(info)
	{
		if (info[1] === irc.info.nick)
		{
			irc.info.nick = info[2];
		}
	});
	irc.on(/^:([^!]+)!([^@]+)@([^ ]+) (JOIN|PRIVMSG) (#[^ ]+)/, function(info)
	{
		irc.info.names[info[5]][info[1]] = {
			nick: info[1],
			user: info[2],
			host: info[3]
		}
	});
	setTimeout(function()
	{
		irc.raw('NICK ' + config.user.nick);
		irc.raw('USER ' + config.user.user + ' 8 * :' + config.user.real);
		setTimeout(function()
		{
			for (var i = 0; i < config.chans.length; i++)
			{
				irc.join(config.chans[i]);
			}
		}, 2000);
	}, 1000);
});

irc.socket.setEncoding('ascii');
irc.socket.setNoDelay();
irc.socket.connect(config.server.port, config.server.addr);

//handles incoming messages
irc.handle = function(data)
{
	var i, info;
	for (i = 0; i < irc.listeners.length; i++)
	{
		info = irc.listeners[i][0].exec(data);
		if (info)
		{
			irc.listeners[i][1](info, data);
			if (irc.listeners[i][2])
			{
				irc.listeners.splice(i, 1);
			}
		}
	}
}


/**
 * Sends a raw IRC message to the server. If possible, try to use one of the
 * "convenience" methods (see below).
 */
irc.raw = function(data)
{
	irc.socket.write(data + '\n', 'ascii', function()
	{
		console.log('SENT -', data);
	});
}

irc.listeners = [];
irc.on = function(data, callback)
{
	irc.listeners.push([data, callback, false])
}
irc.on_once = function(data, callback)
{
	irc.listeners.push([data, callback, true]);
}


/**
 * Convinience methods:
 */

irc.join = function(chan, callback)
{
	if (callback !== undefined)
	{
		irc.on_once(new RegExp('^:' + irc.info.nick + '![^@]+@[^ ]+ JOIN :' + chan), callback);
	}
	irc.info.names[chan] = {};
	irc.raw('JOIN ' + chan);
}

irc.part = function(chan, msg, callback)
{
	if (typeof msg === 'function')
	{
		callback = msg;
		msg = undefined;
	}
	irc.on_once(new RegExp('^:' + irc.info.nick + '![^@]+@[^ ]+ PART ' + chan), callback);
	irc.raw('PART ' + chan + ((msg !== undefined) ? ' :' + msg : ''));
}

irc.msg = function(chan, msg)
{
	var max_length, msgs, interval;
	max_length = 500 - chan.length;

	msgs =  msg.match(new RegExp('.{1,' + max_length + '}', 'g'));

	interval = setInterval(function()
	{
		irc.raw('PRIVMSG ' + chan + ' :' + msgs[0]);
		msgs.splice(0, 1);
		if (msgs.length === 0)
		{
			clearInterval(interval);
		}
	}, 1000);
}

irc.nick = function(nick)
{
	irc.raw('NICK ' + nick);
}

irc.kick = function(nick, chan, msg, ban)
{
	if (ban !== undefined)
	{
		irc.ban(nick, chan, function()
		{
			irc.kick(nick, chan, msg);
		});
		return;
	}
	irc.raw('KICK ' + chan + ' ' + nick + ((msg !== undefined) ? ' :' + msg : ''));
}

irc.ban = function(nick, chan, callback)
{
	var host, regex;
	if (irc.info.names[chan][nick] === undefined)
	{
		return false;
	}
	host = irc.info.names[chan][nick].host;
	regex = '^:' + irc.info.nick + '![^@]+@[^ ]+ MODE ' + chan + ' \\+b \\*!\\*@' + host;
	console.log(regex);
	if (callback !== undefined)
	{
		irc.on_once(new RegExp(regex), function()
		{
			callback();
		});
	}
	irc.raw('MODE ' + chan + ' +b *!*@' + host);
}
