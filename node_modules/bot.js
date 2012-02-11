var net = require('net');

function IRC(config, on) {
	var that = this;
	this.info = {};
	this.info.names = {};
	this.socket = new net.Socket();

	this.socket.on('data', function (data) {
		data = data.split('\r\n');
		for (var i = 0; i < data.length; i++) {
			if (data !== '') {
				if (on !== undefined) {
					on(data[i])
				}
				console.log(data[i]);
				that.handle(data[i]);
			}
		}
	});
	this.socket.on('error', function (exception) {
		console.log('error:', exception);
	});

	this.socket.on('disconnect', function () {
		process.exit();
	});

	this.socket.on('connect', function () {
		console.log('Established connection, registering and shit...');
		that.on(/^PING :(.+)$/i, function (info) {
			that.raw('PONG :' + info[1]);
		});
		that.on(/^[^ ]+ 001 ([0-9a-zA-Z\[\]\\`_\^{|}\-]+) :.+ [^ !]+!([^ !@]+)@([^ @]+)$/, function (info){
			that.info.nick = info[1];
			that.info.user = info[2];
			that.info.host = info[3];
		});
		that.on(/^:([^!]+)![^@]+@[^ ]+ NICK :(.+)$/, function (info) {
			if (info[1] === that.info.nick) {
				that.info.nick = info[2];
			}
		});
		that.on(/^:([^!]+)!([^@]+)@([^ ]+) (JOIN|PRIVMSG) (#[^ ]+)/, function (info) {
			if (that.info.names[info[5]][info[1]] === undefined) {
				that.info.names[info[5]][info[1]] = {
					nick: info[1],
					user: info[2],
					host: info[3]
				}
			}
		});
		setTimeout(function () {
			that.raw('NICK ' + config.user.nick);
			that.raw('USER ' + config.user.user + ' 8 * :' + config.user.real);
			that.msg('NickServ', 'IDENTIFY ' + config.user.pass);
			setTimeout(function () {
				for (var i = 0; i < config.chans.length; i++) {
					that.join(config.chans[i]);
				}
			}, 2000);
		}, 1000);
	});

	this.socket.setEncoding('ascii');
	this.socket.setNoDelay();
	this.socket.connect(config.server.port, config.server.addr);

	//handles incoming messages
	this.handle = function (data) {
		var i, info;
		for (i = 0; i < listeners.length; i++) {
			info = listeners[i][0].exec(data);
			if (info) {
				listeners[i][1](info, data);
				if (listeners[i][2]) {
					listeners.splice(i, 1);
				}
			}
		}
	};


	/**
	 * Sends a raw IRC message to the server. If possible, try to use one of the
	 * "convenience" methods (see below).
	 */
	this.raw = function (data) {
		that.socket.write(data + '\n', 'ascii', function () {
			var info = that.info;
			if (on !== undefined) {
				on(':' + info.nick + '!' + info.user + '@' + info.host + ' ' + data)
			}
		});
		return that;
	};

	listeners = [];
	this.on = function (data, callback) {
		listeners.push([data, callback, false])
		return that;
	};
	this.on_once = function (data, callback) {
		listeners.push([data, callback, true]);
		return that;
	};


	/**
	 * Convinience methods:
	 */

	this.join = function (chan, callback) {
		if (callback !== undefined) {
			that.on_once(new RegExp('^:' + that.info.nick + '![^@]+@[^ ]+ JOIN :' + chan), callback);
		}
		that.info.names[chan] = {};
		that.raw('JOIN ' + chan);
		return that;
	};

	this.part = function(chan, msg, callback) {
		if (typeof msg === 'function') {
			callback = msg;
			msg = undefined;
		}
		if (callback !== undefined) {
			that.on_once(new RegExp('^:' + that.info.nick + '![^@]+@[^ ]+ PART ' + chan), callback);
		}
		delete that.info.names[chan];
		that.raw('PART ' + chan + ((msg !== undefined) ? ' :' + msg : ''));
		return that;
	};

	this.msg = function(chan, msg) {
		var max_length, msgs, interval;
		max_length = 500 - chan.length;

		msgs =  msg.match(new RegExp('.{1,' + max_length + '}', 'g'));

		interval = setInterval(function () {
			that.raw('PRIVMSG ' + chan + ' :' + msgs[0]);
			msgs.splice(0, 1);
			if (msgs.length === 0) {
				clearInterval(interval);
			}
		}, 1000);
		return that;
	};

	this.nick = function (nick) {
		that.raw('NICK ' + nick);
		return that;
	};

	this.kick = function (nick, chan, msg, ban) {
		if (ban !== undefined) {
			that.ban(nick, chan, function () {
				that.kick(nick, chan, msg);
			});
			return that;
		}
		that.raw('KICK ' + chan + ' ' + nick + ((msg !== undefined) ? ' :' + msg : ''));
		return that;
	};

	this.ban = function (nick, chan, callback) {
		var host, regex;
		if (that.info.names[chan][nick] === undefined) {
			return that;
		}
		host = that.info.names[chan][nick].host;
		regex = '^:' + that.info.nick + '![^@]+@[^ ]+ MODE ' + chan + ' \\+b \\*!\\*@' + host;
		console.log(regex);
		if (callback !== undefined) {
			that.on_once(new RegExp(regex), function () {
				callback();
			});
		}
		that.raw('MODE ' + chan + ' +b *!*@' + host);
		return that;
	};

	this.quit = function (reason) {
		that.raw('QUIT :' + reason);
		that.socket.end();
	};
}

module.exports = IRC;
