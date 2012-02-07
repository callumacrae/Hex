handler = function (info, admin, noreply) {
	var chan, cmd, cmd_end, index, flush, nick, reply, pm, log;
	flush = false;
	nick = info[1];
	chan = info[3];

	pm = chan.search(/^[^#]/) !== -1;
	if (pm) {
		chan = nick;
	}

	reply = /^(.+) @ ?(.+)/.exec(info[4]);
	if (reply) {
		info[4] = reply[1];
		nick = reply[2];
	}
	reply = null;

	index = info[4].indexOf(' ');
	cmd = (index === -1) ? info[4] : info[4].slice(0, index);
	cmd_end = (index === -1) ? null : info[4].slice(index + 1);

	if (cmd.search(/(\.|\/)/) !== -1) {
		return false;
	}

	switch (cmd.toLowerCase()) {
		case 'a':
		case 'admin':
			if (!admin) {
				console.log(nick + ' tried to access admin without correct permissions.')
				return false;
			}
			index = cmd_end.indexOf(' ');
			cmd = (index === -1) ? cmd_end : cmd_end.slice(0, index);
			cmd_end = (index === -1) ? null : cmd_end.slice(index + 1);

			switch (cmd.toLowerCase()) {
				case 'help':
				case 'h':
					chan = nick;
					if (cmd_end !== null && cmd_end.toLowerCase() === 'all') {
						reply = [
							'Full list of admin commands, followed by the required admin level in brackets:',
							'help [all]                  - return a list of commands [and what they do]. (1)',
							'ban <user> [<channel>]      - bans a user from a channel. If channel is not specified, defaults to current. (4)',
							'devoice <user> [<channel>]  - devoice a user in a channel. If channel is not specified, defaults to current. (2)',
							'join <channel>              - join a specified channel. (7)',
							'kick <user> [<channel>]     - kick a user from a channel. If channel is not specified, defaults to current. (3)',
							'part [<channel>]            - part a specified channel. If channel is not specified, defaults to current. (7)',
							'quit                        - quits the bot. (10)',
							'raw <command>               - sends the command as raw IRC. (10)',
							'remove <command>            - deletes a command. Please bear in mind that some commands cannot be removed. (6)',
							'restart                     - restarts the bot. (10)',
							'set <command> <message>     - sets a responce to a specified command (eg "set test hello world" will cause the bot to say "hello world" when the user says "hex: test"). (6)',
							'voice <user> [<chan>]       - voice a user in a channel. If channel is not specified, defaults to current. (2)',
							'End of help.'
						];
						break;
					}
					reply = [
						'Currently available admin commands:',
						'help, ban, devoice, gline, join, kick, part, quit, raw, remove, restart, set, shun, voice.',
						'Please not that not all features may be operational, as the bot is still under development.'
					];
					break;

				case 'ban':
					if (admin < 4) {
						reply = 'Admin level 4 required for this operation.';
						break;
					}
					if (cmd_end.indexOf(' ') !== -1) {
						cmd_end = cmd_end.slice(0, cmd_end.indexOf(' '));
						chan = cmd_end.slice(cmd_end.indexOf(' ') + 1);
					}
					hex.kick(cmd_end, chan, 'Requested (' + nick + ')', true);
					log = 'ban ' + cmd_end + ' (from ' + chan + ')';
					break;

				case 'devoice':
					if (admin < 2) {
						reply = 'Admin level 2 required for this operation.';
						break;
					}
					if (cmd_end.indexOf(' ') !== -1) {
						cmd_end = cmd_end.slice(0, cmd_end.indexOf(' '));
						chan = cmd_end.slice(cmd_end.indexOf(' ') + 1);
					}
					hex.raw('MODE ' + chan + ' -v ' + cmd_end);
					log = 'devoice ' + cmd_end + ' (from ' + chan + ')';
					break;

				case 'flush':
					flush = true;
					reply = 'Flushing...';
					break;

				case 'join':
					if (admin < 7) {
						reply = 'Admin level 7 required for this operation.';
						break;
					}
					hex.join(cmd_end);
					config.chans.push(cmd_end);
					log = 'join ' + cmd_end;
					flush = true;
					break;

				case 'kick':
					if (admin < 3) {
						reply = 'Admin level 3 required for this operation.';
						break;
					}
					if (cmd_end.indexOf(' ') !== -1) {
						cmd_end = cmd_end.slice(0, cmd_end.indexOf(' '));
						chan = cmd_end.slice(cmd_end.indexOf(' ') + 1);
					}
					hex.kick(cmd_end, chan, 'Requested (' + nick + ')');
					log = 'kick ' + cmd_end + ' (from ' + chan + ')';
					break;

				case 'mute':
					if (admin < 6) {
						reply = 'Admin level 6 required for this operation.';
						break;
					}
					if (mute.indexOf(chan) === -1) {
						mute.push(chan);
					}
					reply = 'Muted.';
					break;

				case 'part':
					if (admin < 7) {
						reply = 'Admin level 7 required for this operation.';
						break;
					}
					if (cmd_end) {
						chan = cmd_end;
					}
					config.chans.splice(config.chans.indexOf(chan), 1);
					hex.part(chan, 'Requested (' + nick + ')');
					flush = true;
					break;

				case 'quit':
				case 'q':
				case 'restart':
					if (admin < 10) {
						reply = 'Admin level 10 required for this operation.';
						break;
					}
					hex.quit('Requested (' + nick + ')');
					console.log('Restart called by ' + nick);
					process.exit();
					break;

				case 'raw':
					if (admin < 10) {
						reply = 'Admin level 10 required for this operation.';
						break;
					}
					hex.raw(cmd_end);
					console.log(nick + ' sent RAW: ' + cmd_end);
					break;

				case 'remove':
				case 'rm':
					if (admin < 6) {
						reply = 'Admin level 6 required for this operation.';
						break;
					}
					var fs = require('fs');
					fs.unlinkSync('./msgs/' + cmd_end);
					reply = 'Successfully removed ' + cmd_end;
					log = cmd + ' ' + cmd_end;
					break;

				case 'set':
					if (admin < 6) {
						reply = 'Admin level 6 required for this operation.';
						break;
					}

					cmd = cmd_end.slice(0, cmd_end.indexOf(' '));
					cmd_end = cmd_end.slice(cmd_end.indexOf(' ') + 1);

					log = 'set ' + cmd;

					var fs = require('fs');
					fs.writeFileSync('./msgs/' + cmd, cmd_end);
					reply = 'Successfully set ' + cmd;
					break;

				case 'su':
					//dont check whether admin is level 10 yet - level 3s can list admins
					cmd = cmd_end.split(' ', 3);
					switch (cmd[0].toLowerCase()) {
						case 'add':
						case 'set':
							if (admin < 10) {
								reply = 'Admin level 10 required for this operation.';
								break;
							}
							regex = '^:NickServ![^@]+@[^ ]+ NOTICE [^ ]+ :' + cmd[1] + ' ACC ([0-3])';
							hex.on_once(new RegExp(regex), function (status) {
								if (status[1] === '3') {
									console.log(cmd[1] + ' added as admin.');
									if (hex.info.names[chan][cmd[1]] !== undefined) {
										admins[cmd[1]] = {
											host: hex.info.names[chan][cmd[1]].host,
											level: cmd[2]
										}
									}
								}
							});
							hex.msg('NickServ', 'ACC ' + cmd[1]);
							config.su[cmd[1]] = cmd[2];
							console.log(cmd[1] + ' added as admin by ' + nick);
							reply = 'Successfully added ' + cmd[1] + ' as level ' + cmd[2];
							flush = true;
							break;

						case 'remove':
						case 'rm':
							if (admin < 10) {
								reply = 'Admin level 10 required for this operation.';
								break;
							}
							delete config.su[cmd[1]];
							delete admins[cmd[1]];
							reply = 'Successfully removed ' + cmd[1] + ' as super user.';
							flush = true;
							break;

						case 'list':
							var su_nick;
							if (admin < 3) {
								reply = 'Admin level 3 required for this operation.';
								break;
							}
							chan = nick;
							reply = ['List of admins, followed by their level and whether they are signed in or not:'];
							for (su_nick in config.su) {
								reply.push(su_nick + ' is level ' + config.su[su_nick] + ' and is' + ((admins[su_nick] === undefined) ? ' not' : '') + ' currently signed in.');
							}
							reply.push('End of list.');
							break;

						case 'default':
							reply = 'The only commands under "admin su" are "add" (or "set"), "remove" (or "rm"), and "list".';
							break;
					}
					log = 'su ' + cmd;
					break;

				case 'tmpmute':
					if (admin < 4) {
						reply = 'Admin level 4 required for this operation.';
						break;
					}
					if (mute.indexOf(chan) === -1) {
						mute.push(chan);
					}

					setTimeout(function () {
						var i = mute.indexOf(chan);
						if (i !== -1) {
							mute.splice(i, 1);
							hex.raw('PRIVMSG ' + chan + ' :Unmuted. (mute set by ' + info[1] + ')');
						}
					}, 1800000);
					reply = 'Muted for half an hour.';
					break;

				case 'unmute':
					if (admin < 4) {
						reply = 'Admin level 4 required for this operation.';
						break;
					}
					var i = mute.indexOf(chan);
					if (i !== -1) {
						mute.splice(i, 1);
						reply = 'Unmuted.';
						noreply = undefined;
					}
					break;

				case 'voice':
					if (admin < 2) {
						reply = 'Admin level 2 required for this operation.';
						break;
					}
					if (cmd_end.indexOf(' ') !== -1) {
						cmd_end = cmd_end.slice(0, cmd_end.indexOf(' '));
						chan = cmd_end.slice(cmd_end.indexOf(' ') + 1);
					}
					hex.raw('MODE ' + chan + ' +v ' + cmd_end);
					break;

				default:
					reply = 'Command not found. Try "hex: admin help" for a list of admin features.';
					break;
			}
			console.log('"admin ' + ((log === undefined) ? cmd : log) + '" called by ' + nick);
			break;

		case 'g':
		case 'google':
			reply = 'http://google.com/';
			if (cmd_end) {
				reply += 'search?q=' + encodeURIComponent(cmd_end);
			}
			break;

		case 'js':
		case 'javascript':
			var exec = require('child_process').exec;
			if (cmd_end === null) {
				reply = 'The correct syntax for this function is "hex js <code>".';
				break;
			}
			cmd_end = 'node js_run.js "' + cmd_end.replace(/"/g, '\\"') + '"';
			exec(cmd_end, {timeout: 4000}, function (error, stdout, stderr) {
				stderr = stderr.trim();
				if (stderr !== '') {
					stderr = stderr.split('\n')[3];
					var output = stderr;
				} else {
					var output = stdout.trim().slice(0, 100).split('\n')[0].split('\r')[0];
				}

				if (error && error.signal === 'SIGTERM') {
					var output = 'Maximum execution time exceeded.';
				}

				if (!noreply) {
					hex.msg(chan, nick + ': ' + output);
				}
			});
			break;

		case 'lmgtfy':
			reply = 'http://lmgtfy.com/';
			if (cmd_end) {
				reply += '?q=' + encodeURIComponent(cmd_end);
			}
			break;

		case 'uptime':
			var num, uptime = new Date().getTime() - start.getTime();
			reply = 'Uptime: ';
			if (uptime > 86400000) {
				num = Math.floor(uptime / 86400000)
				reply += num + ' day' + ((num === 1) ? '' : 's') + ', ';
				uptime = uptime % 86400000;
			}
			if (uptime > 3600000) {
				num = Math.floor(uptime / 3600000);
				reply += num + ' hour' + ((num === 1) ? '' : 's') + ', ';
				uptime = uptime % 3600000;
			}
			if (uptime > 60000) {
				num = Math.floor(uptime / 60000);
				reply += num + ' minute' + ((num === 1) ? '' : 's') + ' and ';
				uptime = uptime % 60000;
			} else {
				reply += 'and ';
			}
			num = Math.round(uptime / 1000);
			reply += num + ' second' + ((num === 1) ? '' : 's') + '.';
			break;

		case 'regex':
			if (cmd_end === null) {
				reply = 'The correct syntax for this is "regex [pattern] [test]".';
				break;
			}
			try {
				cmd = cmd_end.slice(0, cmd_end.indexOf(' '));
				cmd_end = cmd_end.slice(cmd_end.indexOf(' ') + 1);
				cmd = new RegExp(cmd).exec(cmd_end);
				if (cmd) {
					for (var i = 0; i < cmd.length; i++) {
						cmd[i] = "'" + cmd[i] + "'";
					}
					reply = cmd.join(', ');
				} else {
					reply = 'No match.';
				}
			} catch (err) {
				reply = 'Error: ' + err;
			}
			break;


		case 'w':
		case 'wiki':
			var options = {
				host: 'x10hosting.com',
				port: 80,
				path: '/wiki/index.php?title=Special%3ASearch&search=' + encodeURIComponent(cmd_end),
				method: 'GET'
			};

			var req = http.request(options, function (res) {
				if (res.statusCode === 302 || res.statusCode === 301) {
					var url = res.headers.location
				} else {
					var url = 'http://x10hosting.com/wiki/index.php?title=Special%3ASearch&search=' + encodeURIComponent(cmd_end);
				}
				if (!noreply) {
					hex.msg(chan, nick + ': ' + url);
				}
				res.setEncoding('utf8');
			});
			req.on('error', function (e) {
				console.log('Problem with request: ' + e.message);
			});
			req.end();
			break;

		case 'wa':
		case 'wolfram':
		case 'wolframalpha':
			reply = 'http://www.wolframalpha.com/';
			if (cmd_end) {
				reply += 'input/?i=' + encodeURIComponent(cmd_end);
			}
			break;

		case 'whoami':
			nick = info[1];
			reply = 'Your nick is "' + info[1] + '". Your hostmask is "' + info[2] + '". ';
			reply += (admin) ? 'You are admin level ' + admin + '.' : 'You are not an admin.';
			break;

		default:
			var file, fs = require('fs');
			try {
				file = fs.readFileSync('./msgs/' + cmd, 'utf8');
			} catch(err) {
				if (pm) {
					reply = 'Command not found. Please try "help" for a list of commands.';
				}
				break;
			}
			reply = file.split('\n');
			break;
	}

	if (reply && !noreply) {
		if (typeof reply === 'string') {
			reply = [reply];
		}
		var interval = setInterval(function () {
			if (reply.length === 0 || reply[0] === undefined) {
				clearInterval(interval);
				return;
			}
			hex.msg(chan, ((pm) ? '' : nick + ': ') + reply[0]);
			reply.splice(0, 1);
		}, 200);
	}
	return flush;
};

html_decode = function (s) {
	var c, m, d = s;

	arr = d.match(/&#[0-9]{1,5};/g);

	// if no matches found in string then skip
	if (arr !== null) {
		for (var x = 0; x < arr.length; x++) {
			m = arr[x];
			c = m.substring(2, m.length - 1);
			if (c >= -32768 && c <= 65535) {
				d = d.replace(m, String.fromCharCode(c));
			} else {
				d = d.replace(m, "");
			}
		}
	}
	return d;
};

antiflood = function (nick, chan) {
	if (hex.info.names[chan][nick] === undefined) {
		return;
	}
	var user = hex.info.names[chan][nick];

	if (user.second === undefined) {
		user.second = 1;
		user.twenty = 1;
		user.warning = 0;
		return;
	}

	if (++user.second > config.flood.second || ++user.twenty > config.flood.twenty) {
		user.second = 0;
		user.twenty = 0;

		switch (++user.warning) {
			case 1:
				hex.raw('MODE ' + chan + ' -v ' + nick);
				hex.msg(chan, nick + ': You have been devoiced for 10 seconds for flooding.');
				setTimeout(function () {
					user.second = 0;
					user.twenty = 0;
					hex.raw('MODE ' + chan + ' +v ' + nick);
				}, 10000);
				break;

			case 2:
				hex.raw('MODE ' + chan + ' -v ' + nick);
				hex.msg(chan, nick + ': You have been devoiced for a further 30 seconds for flooding.');
				setTimeout(function () {
					user.second = 0;
					user.twenty = 0;
					hex.raw('MODE ' + chan + ' +v ' + nick);
				}, 30000);
				break;

			case 3:
				hex.raw('MODE ' + chan + ' -v ' + nick);
				hex.msg(chan, nick + ': You have been devoiced for a further two minutes for flooding.');
				setTimeout(function () {
					user.second = 0;
					user.twenty = 0;
					hex.raw('MODE ' + chan + ' +v ' + nick);
				}, 120000);
				break;

			case 4:
				hex.kick(nick, chan, 'Flooding.', true);
				hex.msg(nick, 'You have been banned from ' + chan + ' for flooding.');
				break;
		}
		setTimeout(function () {
			user.warning--;
		}, 600000);
	} else {
		setTimeout(function () {
			if (user.second > 0) {
				user.second--;
			}
		}, 1000);
		setTimeout(function () {
			if (user.twenty > 0) {
				user.twenty--;
			}
		}, 20000);
	}
};

server = function (req, res) {
	var date, file, output;

	var info = /^\/(\d{4})\/(\d{2})\/(\d{2})\.js$/.exec(req.url);
	if (info) {
		date = info[1] + info[2] + info[3];

		try {
			file = fs.readFileSync('./logs/' + date + '.log', 'utf8');
		} catch (err) {
			res.writeHead(404, {'Content-Type': 'text/plain'});
			res.end('404\n');
			return false;
		}

		file = file.split('\n');
		output = 'var log = [';

		for (var i = 0; i < file.length; i++) {
			file[i] = "'" + file[i].replace(/'/g, '\\\'') + "'";
		}

		output += file.join(',\n') + '];';

		res.writeHead(200, {'Content-Type': 'application/javascript'});
		res.end(output + '\n');
		return true;
	}

	var info = /^\/(\d{4})\/(\d{2})\/(\d{2})\/?$/.exec(req.url);
	if (info || req.url === '/') {
		if (info) {
			delete info[0];
		} else {
			date = new Date();
			info = [
				'',
				date.getFullYear(),
				(date.getMonth() > 8) ? date.getMonth() + 1 : '0' + (date.getMonth() + 1),
				(date.getDate() > 9) ? date.getDate() : '0' + date.getDate()
			];
		}

		file = fs.readFileSync('./html/index.html', 'utf8');

		file = file.replace('YYYY/MM/DD', info.join('/').slice(1))
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(file + '\n');
		return true;
	}

	if (req.url === '/script.js') {
		file = fs.readFileSync('./html/script.js');
		res.writeHead(200, {'Content-Type': 'application/javascript'});
		res.end(file + '\n');
		return true;
	}

	if (req.url === '/style.css') {
		file = fs.readFileSync('./html/style.css');
		res.writeHead(200, {'Content-Type': 'text/css'});
		res.end(file + '\n');
		return true;
	}

	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.end('404\n');
	return true;
};
