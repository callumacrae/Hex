var IRC = require('./bot'),
	config = require('./config'),
	handle = require('./handler'),
	admin, hex, admins = {};

hex = new IRC(config)

function handler(info)
{
	admin = (admins[info[1]] === undefined) ? 0 : admins[info[1]].level;
	if (admin && info[2] !== admins[info[1]].host)
	{
		console.log([admin, info[2], admins[info[1]].host]);
		console.log('Unauthorised access attempt by ' + info[2] + ' as ' + info[1]);
		return false;
	}

	handle(info, hex, admin);
}

hex.on(/^:([^!]+)![^@]+@([^ ]+) PRIVMSG (#[^ ]+) :hex:? (.+)/i, handler);
hex.on(/^:([^!]+)![^@]+@([^ ]+) PRIVMSG ([^# ]+) :(.+)/i, handler);

hex.on(/^:([^!]+)![^@]+@([^ ]+) (JOIN|QUIT)/, function(info)
{
	var nick, regex;
	nick = info[1];
	if (config.su[nick] === undefined)
	{
		return false;
	}

	switch (info[3])
	{
		case 'JOIN':
			regex = '^:NickServ![^@]+@[^ ]+ NOTICE [^ ]+ :STATUS ' + nick + ' ([0-3])';
			hex.on_once(new RegExp(regex), function(status)
			{
				if (status[1] === '3')
				{
					console.log(nick + ' added as admin.');
					admins[nick] = {
						host: info[2],
						level: config.su[info[1]]
					}
				}
			});
			hex.msg('NickServ', 'STATUS ' + nick);
			break;

		case 'QUIT':
			delete admins[nick];
			break;
	}
});

hex.on(/^:([^!]+)![^@]+@[^ ]+ NICK :(.+)$/, function(info)
{
	var new_nick, nick;
	nick = info[1];
	new_nick = info[2];
	if (admins[nick] === undefined)
	{
		return false;
	}

	admins[new_nick] = admins[nick];
	delete admins[nick];
});
