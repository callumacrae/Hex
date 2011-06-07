var IRC = require('bot'),
	config = require('../config'),
	hex, handle, game = {};

config.user = config.user_game;
config.chans = ['#games'];

eval(fs.readFileSync('./handler.js', 'utf8'));

hex = new IRC(config);

game.players = [];
game.answers = [];
game.votes = {};
game.game = {};

hex.on(/^:([^!]+)![^@]+@[^ ]+ PRIVMSG ([^ ]+) :(.+)$/i, function(info)
{
	var re = handle(info, info[1] === 'callumacrae');
	if (re === 'FLUSH')
	{
		eval(fs.readFileSync('./handler.js', 'utf8'));
	}
});

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
		status: 'vote' //pre, submit, votw
	}
}