var IRC = require('bot'),
	config = require('../config'),
	fs = require('fs'),
	hex, handle, game = {};

config.user = config.user_game;
config.chans = ['#games'];

eval(fs.readFileSync('./games/handler.js', 'utf8'));

hex = new IRC(config);

game.players = [];
game.answers = [];
game.votes = {};
game.game = {};

hex.on(/^:([^!]+)![^@]+@[^ ]+ PRIVMSG ([^ ]+) :(.+)$/i, function(info)
{
	var re = handler(info, info[1] === 'callumacrae');
	if (re === 'FLUSH')
	{
		eval(fs.readFileSync('./games/handler.js', 'utf8'));
	}
});

function pre()
{
	game.game.status = 'pre';
	hex.msg('#games', 'The game will start in 10 seconds. If you want to play, please PM "join" to me.');
	setTimeout(function()
	{
		submit();
	}, 10000);
}

function submit()
{
	game.game.status = 'submit';
	hex.msg('#games', 'Let the game begin!');
	hex.msg('#games', 'This round is: initials.');
	hex.msg('#games', 'The initials are "DYSW".');
	hex.msg('#games', 'PM me your answers now! You have thirty seconds.');
	setTimeout(function()
	{
		vote();
	}, 30000);
}

function vote()
{
	game.game.status = 'vote';
	var reply = ['Stop submitting answers! The answers submitted are as follows:'];
	for (var i = 0; i < game.answers.length; i++)
	{
		reply.push(i + ': ' + game.answers[i][1]);
	}
	reply.push('Vote for your favourite by PMing "vote <number>" to me. You have 20 seconds to vote.');
	var interval = setInterval(function()
	{
		if (reply.length === 0)
		{
			clearInterval(interval);
			return false;
		}

		hex.msg('#games', reply[0]);
		reply.splice(0, 1);
		return false;
	}, 1000);

	setTimeout(function()
	{
		winner();
	}, 20000);
}

function winner()
{
	var voter;
	for (voter in game.votes)
	{
		game.answers[game.votes[voter]][2]++;
	}

	var ans, reply = ['Round over. The scores are as follows:'];
	for (id in game.answers)
	{
		ans = game.answers[id];
		reply.push(ans[0] + ' got ' + ans[2] + ' vote' + (ans[2] === 1 ? '' : 's') + '.');
	}

	var interval = setInterval(function()
	{
		if (reply.length === 0)
		{
			clearInterval(interval);
			pre();
			return false;
		}

		hex.msg('#games', reply[0]);
		reply.splice(0, 1);
		return false;
	}, 1000);
}

setTimeout(function()
{
	pre();
}, 10000);

/*
game = {
	players: [['callumacrae', 12], ['test', 5]],
	answers: [
		['callumacrae', 'My answer here'],
		['test', 'Fake answer']
	],
	votes: {
		callumacrae: 1 //answer id
	},
	game: {
		current: ['initials', 'WIFB'],
		next: 'word', //event, word, law, initials, people
		rounds: 2,
		status: 'vote' //pre, submit, vote
	}
}*/