var net = require('net'),
	irc = {}, options;

options = {
	nick: 'XB-2',
	user: 'XB',
	real: 'Callums bitch',
	server: 'irc.x10hosting.com',
	port: 6667
}

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
	irc.on(/^PING :(.+)$/i, function()
	{
		irc.raw('PONG :$1');
	});
	setTimeout(function()
	{
		irc.raw('NICK ' + options.nick);
		irc.raw('USER ' + options.user + ' 8 * :' + options.real);
		irc.join('#cjasdklj', function()
		{
			irc.msg('#cjasdklj', 'Hello! I am XB, how can I help?');
		});
	}, 1000);
});

irc.socket.setEncoding('ascii');
irc.socket.setNoDelay();
irc.socket.connect(options.port, options.server);

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
	irc.on_once(new RegExp('^:' + options.nick + '![^@]+@[^ ]+ JOIN :' + chan), callback);
	irc.raw('JOIN ' + chan);
}

irc.part = function(chan, msg, callback)
{
	if (typeof msg === 'function')
	{
		callback = msg;
		msg = undefined;
	}
	irc.on_once(new RegExp('^:' + options.nick + '![^@]+@[^ ]+ PART ' + chan), callback);
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
