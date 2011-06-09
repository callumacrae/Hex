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
	hex.msg('#games', 'PM me your answers now! You have twenty seconds.');
	setTimeout(function()
	{
		vote();
	}, 20000);
}

function vote()
{
	game.game.status = 'vote';
	hex.msg('#games', 'Tiems up. VOTE.');
	setTimeout(function()
	{
		winner();
	}, 10000);
}

function winner()
{
	console.log(game);
	hex.msg('#games', 'Dunno the winner. Just a dummy bot.');
	pre();
}

setTimeout(function()
{
	pre();
}, 5000);

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