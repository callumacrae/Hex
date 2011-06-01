var net = require('net'),
	Logger = require('logger');

function IRC(config)
{
	Logger = new Logger(config.log);
	var __self = this;
	this.info = {};
	this.info.names = {};
	this.socket = new net.Socket();

	this.socket.on('data', function(data)
	{
		data = data.split('\r\n');
		for (var i = 0; i < data.length; i++)
		{
			if (data !== '')
			{
				Logger.log(data[i]);
				__self.handle(data[i]);
			}
		}
	});
	this.socket.on('error', function(exception)
	{
		console.log('error:', exception);
	});

	this.socket.on('connect', function()
	{
		console.log('Established connection, registering and shit...');
		__self.on(/^PING :(.+)$/i, function(info)
		{
			__self.raw('PONG :' + info[1]);
		});
		__self.on(/^[^ ]+ 001 ([0-9a-zA-Z\[\]\\`_\^{|}\-]+) :.+ [^ !]+!([^ !@]+)@([^ @]+)$/, function(info)
		{
			__self.info.nick = info[1];
			__self.info.user = info[2];
			__self.info.host = info[3];
		});
		__self.on(/^:([^!]+)![^@]+@[^ ]+ NICK :(.+)$/, function(info)
		{
			if (info[1] === __self.info.nick)
			{
				__self.info.nick = info[2];
			}
		});
		__self.on(/^:([^!]+)!([^@]+)@([^ ]+) (JOIN|PRIVMSG) (#[^ ]+)/, function(info)
		{
			if (__self.info.names[info[5]][info[1]] === undefined)
			{
				__self.info.names[info[5]][info[1]] = {
					nick: info[1],
					user: info[2],
					host: info[3]
				}
			}
		});
		setTimeout(function()
		{
			__self.raw('NICK ' + config.user.nick);
			__self.raw('USER ' + config.user.user + ' 8 * :' + config.user.real);
			__self.msg('NickServ', 'IDENTIFY ' + config.user.pass);
			setTimeout(function()
			{
				for (var i = 0; i < config.chans.length; i++)
				{
					__self.join(config.chans[i]);
				}
			}, 2000);
		}, 1000);
	});

	this.socket.setEncoding('ascii');
	this.socket.setNoDelay();
	this.socket.connect(config.server.port, config.server.addr);

	//handles incoming messages
	this.handle = function(data)
	{
		var i, info;
		for (i = 0; i < listeners.length; i++)
		{
			info = listeners[i][0].exec(data);
			if (info)
			{
				listeners[i][1](info, data);
				if (listeners[i][2])
				{
					listeners.splice(i, 1);
				}
			}
		}
	}


	/**
	 * Sends a raw IRC message to the server. If possible, try to use one of the
	 * "convenience" methods (see below).
	 */
	this.raw = function(data)
	{
		__self.socket.write(data + '\n', 'ascii', function()
		{
			var info = __self.info;
			Logger.log(':' + info.nick + '!' + info.user + '@' + info.host + ' ' + data);
		});
		return __self;
	}

	listeners = [];
	this.on = function(data, callback)
	{
		listeners.push([data, callback, false])
		return __self;
	}
	this.on_once = function(data, callback)
	{
		listeners.push([data, callback, true]);
		return __self;
	}


	/**
	 * Convinience methods:
	 */

	this.join = function(chan, callback)
	{
		if (callback !== undefined)
		{
			__self.on_once(new RegExp('^:' + __self.info.nick + '![^@]+@[^ ]+ JOIN :' + chan), callback);
		}
		__self.info.names[chan] = {};
		__self.raw('JOIN ' + chan);
		return __self;
	}

	this.part = function(chan, msg, callback)
	{
		if (typeof msg === 'function')
		{
			callback = msg;
			msg = undefined;
		}
		__self.on_once(new RegExp('^:' + __self.info.nick + '![^@]+@[^ ]+ PART ' + chan), callback);
		__self.raw('PART ' + chan + ((msg !== undefined) ? ' :' + msg : ''));
		return __self;
	}

	this.msg = function(chan, msg)
	{
		var max_length, msgs, interval;
		max_length = 500 - chan.length;

		msgs =  msg.match(new RegExp('.{1,' + max_length + '}', 'g'));

		interval = setInterval(function()
		{
			__self.raw('PRIVMSG ' + chan + ' :' + msgs[0]);
			msgs.splice(0, 1);
			if (msgs.length === 0)
			{
				clearInterval(interval);
			}
		}, 1000);
		return __self;
	}

	this.nick = function(nick)
	{
		__self.raw('NICK ' + nick);
		return __self;
	}

	this.kick = function(nick, chan, msg, ban)
	{
		if (ban !== undefined)
		{
			__self.ban(nick, chan, function()
			{
				__self.kick(nick, chan, msg);
			});
			return __self;
		}
		__self.raw('KICK ' + chan + ' ' + nick + ((msg !== undefined) ? ' :' + msg : ''));
		return __self;
	}

	this.ban = function(nick, chan, callback)
	{
		var host, regex;
		if (__self.info.names[chan][nick] === undefined)
		{
			return __self;
		}
		host = __self.info.names[chan][nick].host;
		regex = '^:' + __self.info.nick + '![^@]+@[^ ]+ MODE ' + chan + ' \\+b \\*!\\*@' + host;
		console.log(regex);
		if (callback !== undefined)
		{
			__self.on_once(new RegExp(regex), function()
			{
				callback();
			});
		}
		__self.raw('MODE ' + chan + ' +b *!*@' + host);
		return __self;
	}

	this.quit = function(reason)
	{
		__self.raw('QUIT :' + reason);
		__self.socket.end();
	}
}

module.exports = IRC;
