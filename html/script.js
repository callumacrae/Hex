var form = document.getElementsByTagName('form')[0];
var title = document.getElementsByTagName('h1')[0];
var ul = document.getElementsByTagName('ul')[0];

chan = window.location.hash;
load_chan((chan == '') ? '#x10hosting' : chan);

$(window).bind('hashchange', function()
{
	chan = window.location.hash;
	load_chan(chan);
});

var d = new Date();
document.getElementById('year').value = d.getFullYear();
document.getElementById('month').value = ((d.getMonth() < 9) ? '0' : '') + (d.getMonth() + 1);
document.getElementById('day').value = ((d.getDate() < 10) ? '0' : '') + d.getDate();


$('input[type=text]').bind('focus', function()
{
	this.value = '';
});

$('#year').bind('keyup', function()
{
	if (this.value.length === 4)
	{
		$('#month').focus();
	}
});

$('#month').bind('keyup', function()
{
	if (this.value.length === 2)
	{
		$('#day').focus();
	}
});

$('#day').bind('keyup', function()
{
	if (this.value.length === 2)
	{
		console.log('boom');
		submit();
	}
});

$('input[type=text]').bind('blur', function()
{
	if (this.value !== '')
	{
		return;
	}
	switch (this.id)
	{
		case 'year':
			this.value = d.getFullYear();
			return;

		case 'month':
			this.value = ((d.getMonth() < 9) ? '0' : '') + (d.getMonth() + 1);
			return;

		case 'day':
			this.value = ((d.getDate() < 10) ? '0' : '') + d.getDate();
			return;
	}
});

function submit()
{
	var year, month, date;
	year = parseInt(form[0].value);
	month = parseInt(form[1].value);
	day = parseInt(form[2].value);

	if (year === NaN || month === NaN || day === NaN)
	{
		return false;
	}

	document.location = '/' + year + '/' + ((month < 10) ? '0' : '') + month + '/' + ((day < 10) ? '0' : '') + day + '/' + chan;
	return false;
}

$(form).bind('submit', function(event)
{
	event.preventDefault();
	submit();
});

function load_chan(chan)
{
	var data, i, html = '';
	document.title = 'Hexadecimal IRC Logs \u2022 Logs for ' + chan;
	title.innerHTML = 'Logs for ' + chan;

	try
	{
		var test = log;
	}
	catch (err)
	{
		ul.innerHTML = '<li>No logs for this day, please try another.</li>';
		return false;
	}

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
	if (!html)
	{
		html = '<li>No log entries for ' + chan + ' on this date</li>';
	}
	ul.innerHTML = html;
}

function em(text)
{
	return '<strong>' + text + '</strong>';
}

function esc(text, format)
{
	text = text.replace(/&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
	if (format)
	{
		var regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		text = text.replace(regex, '<a href="$1" target="_blank">$1</a>');

		regex = /(www\.[\S]+(\b|$))/ig;
		text = text.replace(regex, '<a href="http://$1" target="_blank">$1</a>');

		regex = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/ig;
		text = text.replace(regex, '<a href="mailto:$1">$1</a>');

		regex = /(#[^# ]+)/ig;
		text = text.replace(regex, '<a href="$1">$1</a>');
	}
	return text;
}

function format(data)
{
	//format the time
	var msg, t = new Date(data.time);
	msg = t.getHours() + ':' + ((t.getMinutes() <= 9) ? '0' : '') + t.getMinutes() + ':' + ((t.getSeconds() <= 9) ? '0' : '') + t.getSeconds() + ' ';

	switch (data.cmd.toUpperCase())
	{
		case 'ACTION':
			msg += '&nbsp; ' + em('* ' + data.user.nick) + '</strong> ' + esc(data.msg, true);
			break;

		case 'JOIN':
			msg += '-!- ' + em(data.user.nick) + ' [' + data.user.user + '@' + data.user.host;
			msg += '] has joined the channel.';
			break;

		case 'KICK':
			msg += '-!- ' + em(data.user.nick) + ' has kicked ' + em(data.nick) + ' from the channel.';
			if (data.msg)
			{
				msg += ' (' + esc(data.msg, true) + ')';
			}
			break;

		case 'NICK':
			msg += '-!- ' + data.user.nick + ' is now known as ' + data.nick;
			break;

		case 'MODE':
			msg += '-!- mode ' + data.msg + ' by ' + data.user.nick;
			break;

		case 'NOTICE':
			msg += em('- ' + data.user.nick + ' - ') + esc(data.msg, true);
			break;

		case 'PRIVMSG':
			msg += em('&lt;' + data.user.nick + '&gt; ') + esc(data.msg, true);
			break;

		case 'PART':
			msg += '-!- ' + em(data.user.nick) + ' [' + data.user.user + '@' + data.user.host;
			msg += '] has left the channel.';
			if (data.msg)
			{
				msg += ' (' + esc(data.msg, true) + ')';
			}
			break;

		case 'QUIT':
			msg += '-!- ' + em(data.user.nick) + ' [' + data.user.user + '@' + data.user.host + '] has quit.';
			if (data.msg)
			{
				msg += ' (' + esc(data.msg, true) + ')';
			}
			break;

		case 'TOPIC':
			msg += '-!- ' + data.user.nick + ' has changed the topic to: ' + esc(data.msg, true);
			break;

		default:
			console.log(data.cmd + ' does not exist.');
			return false;
	}
	return msg;
}