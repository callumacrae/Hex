function handle(info, hex)
{
	var chan, cmd, cmd_end, index, nick, reply, pm;
	nick = info[1];
	chan = info[2];

	pm =  !chan.search(/^#/);

	index = info[3].indexOf(' ');
	cmd = (index === -1) ? info[3] : info[3].slice(0, index);
	cmd_end = (index === -1) ? null : info[3].slice(index + 1);

	switch (cmd.toLowerCase())
	{
		case 'a':
		case 'admin':
			index = cmd_end.indexOf(' ');
			cmd = (index === -1) ? cmd_end : cmd_end.slice(0, index);
			cmd_end = (index === -1) ? null : cmd_end.slice(index + 1);

			switch (cmd.toLowerCase())
			{
				case 'help':
					chan = nick;
					if (cmd_end !== null && cmd_end.toLowerCase() === 'all')
					{
						reply = [
							'Full list of admin commands:',
							'help [all] - return a list of commands [and what they do].',
							'test'
						];
					}
					reply = [
						'Currently available admin commands: ',
						'help'
					];
					break;

				default:
					//command not found
			}
			break;

		case 'about':
			reply = [
				'This IRC bot was first written by Sharky, and then completely rewritten by Callum Macrae (callumacrae) into Node.js',
				'The source is available at https://github.com/callumacrae/'
			];

		case 'help':
			reply = 'Under construction.';
			break;

		default:
			//command not found or in a file
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