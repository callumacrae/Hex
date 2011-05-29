function handle(info, hex, admin)
{
	var chan, cmd, cmd_end, index, nick, reply, pm;
	nick = info[1];
	chan = info[3];

	pm =  chan.search(/^[^#]/) !== -1;
	if (pm)
	{
		chan = nick;
	}

	reply = /^(.+) @ ?(.+)/.exec(info[4]);
	if (reply)
	{
		info[4] = reply[1];
		nick = reply[2];
	}

	index = info[4].indexOf(' ');
	cmd = (index === -1) ? info[4] : info[4].slice(0, index);
	cmd_end = (index === -1) ? null : info[4].slice(index + 1);

	if (cmd.search(/(\.|\/)/) !== -1)
	{
		return false;
	}

	switch (cmd.toLowerCase())
	{
		case 'a':
		case 'admin':
			if (!admin)
			{
				console.log(nick + ' tried to access admin without correct permissions.')
				return false;
			}
			index = cmd_end.indexOf(' ');
			cmd = (index === -1) ? cmd_end : cmd_end.slice(0, index);
			cmd_end = (index === -1) ? null : cmd_end.slice(index + 1);

			console.log('"admin ' + cmd + '" called by ' + nick);

			switch (cmd.toLowerCase())
			{
				case 'help':
				case 'h':
					chan = nick;
					if (cmd_end !== null && cmd_end.toLowerCase() === 'all')
					{
						reply = [
							'Full list of admin commands, followed by the required admin level in brackets:',
							'help [all]                  - return a list of commands [and what they do]. (1)',
							'ban <user> [<channel>]      - bans a user from a channel. If channel is not specified, defaults to current. (4)',
							'devoice <user> [<channel>]  - devoice a user in a channel. If channel is not specified, defaults to current. (2)',
							'gline <user>                - glines the specified user. Feature not yet operational. (9)',
							'join <channel>              - join a specified channel. (7)',
							'kick <user> [<channel>]     - kick a user from a channel. If channel is not specified, defaults to current. (3)',
							'part [<channel>]            - part a specified channel. If channel is not specified, defaults to current. (7)',
							'quit                        - quits the bot. (10)',
							'raw <command>               - sends the command as raw IRC. (10)',
							'remove <command>            - deletes a command. Please bear in mind that some commands cannot be removed. (6)',
							'restart                     - restarts the bot. (10)',
							'set <command> <message>     - sets a responce to a specified command (eg "set test hello world" will cause the bot to say "hello world" when the user says "hex: test"). (6)',
							'shun <user>                 - tempshuns the specified user. Feature not yet operational. (9)',
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
					if (admin < 4)
					{
						reply = 'Admin level 4 required for this operation.';
						break;
					}
					if (cmd_end.indexOf(' ') !== -1)
					{
						cmd_end = cmd_end.slice(0, cmd_end.indexOf(' '));
						chan = cmd_end.slice(cmd_end.indexOf(' ') + 1);
					}
					hex.kick(cmd_end, chan, 'Requested (' + nick + ')', true);
					break;

				case 'devoice':
					if (admin < 2)
					{
						reply = 'Admin level 2 required for this operation.';
						break;
					}
					if (cmd_end.indexOf(' ') !== -1)
					{
						cmd_end = cmd_end.slice(0, cmd_end.indexOf(' '));
						chan = cmd_end.slice(cmd_end.indexOf(' ') + 1);
					}
					irc.raw('MODE ' + chan + ' -v ' + cmd_end);
					break;

				case 'gline':
					if (admin < 9)
					{
						reply = 'Admin level 9 required for this operation.';
						break;
					}
					reply = 'Feature hasn\'t yet been developed.';
					break;

				case 'join':
					if (admin < 7)
					{
						reply = 'Admin level 7 required for this operation.';
						break;
					}
					hex.join(cmd_end);
					break;

				case 'kick':
					if (admin < 3)
					{
						reply = 'Admin level 3 required for this operation.';
						break;
					}
					if (cmd_end.indexOf(' ') !== -1)
					{
						cmd_end = cmd_end.slice(0, cmd_end.indexOf(' '));
						chan = cmd_end.slice(cmd_end.indexOf(' ') + 1);
					}
					hex.kick(cmd_end, chan, 'Requested (' + nick + ')');
					break;

				case 'part':
					if (admin < 7)
					{
						reply = 'Admin level 7 required for this operation.';
						break;
					}
					if (cmd_end)
					{
						chan = cmd_end;
					}
					hex.part(chan, 'Requested');
					break;

				case 'quit':
				case 'q':
				case 'restart':
					if (admin < 10)
					{
						reply = 'Admin level 10 required for this operation.';
						break;
					}
					hex.quit('Requested');
					process.exit();
					break;

				case 'raw':
					if (admin < 10)
					{
						reply = 'Admin level 10 required for this operation.';
						break;
					}
					hex.raw(cmd_end);
					break;

				case 'remove':
				case 'rm':
					if (admin < 6)
					{
						reply = 'Admin level 6 required for this operation.';
						break;
					}
					var fs = require('fs');
					fs.unlinkSync('./msgs/' + cmd_end);
					reply = 'Successfully removed ' + cmd_end;
					break;

				case 'set':
					if (admin < 6)
					{
						reply = 'Admin level 6 required for this operation.';
						break;
					}

					cmd = cmd_end.slice(0, cmd_end.indexOf(' '));
					cmd_end = cmd_end.slice(cmd_end.indexOf(' ') + 1);

					var fs = require('fs');
					fs.writeFileSync('./msgs/' + cmd, cmd_end);
					reply = 'Successfully set ' + cmd;
					break;

				case 'shun':
					if (admin < 9)
					{
						reply = 'Admin level 9 required for this operation.';
						break;
					}
					reply = 'Feature hasn\'t yet been developed.';
					break;

				case 'voice':
					if (admin < 2)
					{
						reply = 'Admin level 2 required for this operation.';
						break;
					}
					if (cmd_end.indexOf(' ') !== -1)
					{
						cmd_end = cmd_end.slice(0, cmd_end.indexOf(' '));
						chan = cmd_end.slice(cmd_end.indexOf(' ') + 1);
					}
					irc.raw('MODE ' + chan + ' +v ' + cmd_end);
					break;

				default:
					reply = 'Command not found. Try "hex: admin help" for a list of admin features.';
					break;
			}
			break;

		case 'help':
			reply = 'Under construction.';
			break;

		case 'whoami':
			reply = 'Your nick is "' + info[1] + '". Your hostmask is "' + info[2] + '". ';
			reply += (admin) ? 'You are admin level ' + admin + '.' : 'You are not an admin.';
			break;

		default:
			var file, fs = require('fs');
			try
			{
				file = fs.readFileSync('./msgs/' + cmd, 'utf8');
			}
			catch(err)
			{
				//command not found
				break;
			}
			reply = file.split('\n');
			break;
	}

	if (reply)
	{
		if (typeof reply === 'string')
		{
			reply = [reply];
		}
		interval = setInterval(function()
		{
			hex.msg(chan, ((pm) ? '' : nick + ': ') + reply[0]);
			reply.splice(0, 1);
			if (reply.length === 0)
			{
				clearInterval(interval);
			}
		}, 200);
	}
}

module.exports = handle;