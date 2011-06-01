var body = document.getElementsByTagName('body')[0];
chan = window.location.hash;
load_chan((chan == '') ? '#x10hosting' : chan);

$(window).bind('hashchange', function()
{
	chan = window.location.hash;
	load_chan(chan);
});

function load_chan(chan)
{
	var data, i, html;
	document.title = 'Hexadecimal IRC Logs \u2022 Logs for ' + chan;
	html = '<h1>Logs for ' + chan + '</h1><ul>';
	for (i = 0; i < log.length; i++)
	{
		try
		{
			data = JSON.parse(log[i]);
		}
		catch (err)
		{
			//console.log(err, log[i]);
			continue;
		}

		if (data.chan !== chan && data.cmd !== 'QUIT')
		{
			continue;
		}

		data = format(data);
		if (data)
		{
			html += '<li>' + data + '</li>';
		}
	}
	body.innerHTML = html;
}

function em(text)
{
	return '<strong>' + text + '</strong>';
}

function esc(text)
{
	return text.replace(/&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
}

function format(data)
{
	//format the time
	var msg, t = new Date(data.time);
	msg = t.getHours() + ':' + ((t.getMinutes() <= 9) ? '0' : '') + t.getMinutes() + ':' + ((t.getSeconds() <= 9) ? '0' : '') + t.getSeconds() + ' ';

	switch (data.cmd.toUpperCase())
	{
		case 'ACTION':
			msg += '&nbsp; ' + em('* ' + data.user.nick) + '</strong> ' + esc(data.msg);
			break;

		case 'JOIN':
			msg += '-!- ' + em(data.user.nick) + ' [' + data.user.user + '@' + data.user.host;
			msg += '] has joined the channel.';
			break;

		case 'KICK':
			msg += '-!- ' + em(data.user.nick) + ' has kicked ' + em(data.nick) + ' from the channel.';
			if (data.msg)
			{
				msg += ' (' + esc(data.msg) + ')';
			}
			break;

		case 'NICK':
			msg += '-!- ' + data.user.nick + ' is now known as ' + data.nick;
			break;

		case 'MODE':
			msg += '-!- mode ' + data.msg + ' by ' + data.user.nick;
			break;

		case 'NOTICE':
			msg += em('- ' + data.user.nick + ' - ') + esc(data.msg);
			break;

		case 'PRIVMSG':
			msg += em('&lt;' + data.user.nick + '&gt; ') + esc(data.msg);
			break;

		case 'PART':
			msg += '-!- ' + em(data.user.nick) + ' [' + data.user.user + '@' + data.user.host;
			msg += '] has left the channel.';
			if (data.msg)
			{
				msg += ' (' + esc(data.msg) + ')';
			}
			break;

		case 'QUIT':
			msg += '-!- ' + em(data.user.nick) + ' [' + data.user.user + '@' + data.user.host + '] has quit.';
			if (data.msg)
			{
				msg += ' (' + esc(data.msg) + ')';
			}
			break;

		case 'TOPIC':
			msg += '-!- ' + data.user.nick + ' has changed the topic to: ' + esc(data.msg);
			break;

		default:
			console.log(data.cmd + ' does not exist.');
			return false;
	}
	return msg;
}