var net = require('net'),
	irc = {};

irc.socket = new net.Socket();

irc.socket.on('data', function(data)
{
	console.log('RECV -', data);
	irc.handle(data);
});
irc.socket.on('error', function(exception)
{
	console.log('error:', exception);
});

irc.socket.on('connect', function()
{
	console.log('Established connection, registering and shit...');
	irc.on('PING :(.+)', function()
	{
		irc.raw('PONG :$2');
	});
	setTimeout(function()
	{
		irc.raw('NICK XB-2');
		irc.raw('USER XB 8 * :Callums bitch');
		//send_data('JOIN #Giffgaff');
	}, 1000);
});

irc.setEncoding('ascii');
irc.setNoDelay();
irc.connect(6667, 'irc.x10hosting.com');

//handles incoming messages
irc.handle = function(data)
{
	foreach (regex in irc.listeners)
	{
		info = regex.exec(data);
		if (info)
		{
			foreach (callback in irc.listeners[regex])
			{
				irc.listeners[regex][callback](info, data);
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
	irc.write(data + '\n', 'ascii', function()
	{
		console.log('SENT -', data);
	});
}

irc.listeners = {};
irc.on = function(data, callback)
{
	if (typeof data !== 'regex')
	{
		data = new RegExp('^:([0-9a-zA-Z\\[\\]\\\\`_\\^{|}\\-]+)!~?[0-9a-zA-Z.\\-\\/]+@[0-9a-zA-Z.\\-\\/]+ ' + data, 'i');
	}

	if (irc.listeners[data] === undefined)
	{
		irc.listeners[data] = [callback];
	}
	else
	{
		irc.listeners[data].push(callback);
	}
}


/**
 * Convinience methods:
 */
