handler = function(info, admin)
{
	if (info[3].search('flush') && admin)
	{
		return 'FLUSH';
	}

	if (info[2] === hex.info.nick)
	{
		var reply, cmd = info[3].split(' ');

		if (cmd[0].toLowerCase() === 'quit' || cmd[0].toLowerCase() === 'leave')
		{
			reply = 'You\'re not playing the game, and therefore cannot leave it.';
			for (var i = 0; i < game.players.length; i++)
			{
				if (game.players[i][0] === info[1])
				{
					game.players.splice(i, 1);
					reply = 'You have successfully left the game.';
					break;
				}
			}
			hex.msg(info[1], reply);
			return true;
		}

		switch(game.game.status)
		{
			case 'pre':
				if (cmd[0].toLowerCase() === 'join')
				{
					//check that they're not already playing
					var playing = false;
					for (var i = 0; i < game.players.length; i++)
					{
						if (game.players[i][0] === info[1])
						{
							playing = true;
							break;
						}
					}
					if (playing)
					{
						reply = 'You cannot join the game; you\'re already playing.';
					}
					else
					{
						game.players.push([info[1], 0]);
						reply = 'Successfully joined the game. Use "quit" or "leave" to leave the game.';
					}
				}
				else
				{
					reply = 'Command not found.';
				}
				break;

			case 'submit':
				var playing = false;
				for (var i = 0; i < game.players.length; i++)
				{
					if (game.players[i][0] === info[1])
					{
						playing = true;
						break;
					}
				}
				if (!playing)
				{
					reply = 'But... you\'re not playing :/';
				}
				else
				{
					var playing = true;
					for (i = 0; i < game.answers.length; i++)
					{
						if (game.answers[i][0] === info[1])
						{
							playing = false;
						}
					}
					if (playing)
					{
						game.answers.push([info[1], info[3]]);
						reply = 'Successfully submitted.';
					}
					else
					{
						reply = 'You\'ve already submitted your answer...';
					}
				}
				break;

			case 'vote':
				if (cmd[0].toLowerCase() === 'vote')
				{
					if (game.answers[cmd[1]] === undefined)
					{
						reply = 'The player you voted for... doesn\'t exist.'
					}
					else
					{
						game.votes[info[1]] = cmd[1];
						reply = 'Successfully voted.'
					}
				}
				else
				{
					reply = 'Command not found.';
				}
				break;
		}
	}
}