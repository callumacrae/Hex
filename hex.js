var IRC = require('./bot'),
	config = require('./config'),
	hex;

hex = new IRC(config);

function handle(info)
{
	var chan, cmd, cmd_end, index, nick, reply;
	nick = info[1];
	chan = info[2];

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
					reply = 'GO DIE';
					break;

				default:
					//command not found
			}
			break;

		case 'help':
			reply = 'Hello!';
			break;

		default:
			//command not found or in a file
			break;
	}

	if (reply)
	{
		hex.msg(chan, nick + ': ' + reply);
	}
}

hex.on(/^:([^!]+)![^@]+@[^ ]+ PRIVMSG (#[^ ]+) :hex: (.+)/i, handle);
hex.on(/^:([^!]+)![^@]+@[^ ]+ PRIVMSG ([^# ]+) :(.+)/i, handle)