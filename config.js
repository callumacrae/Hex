var config = {
	user: {
		nick: 'Hex',
		user: 'Hex',
		real: 'Hexidecimal',
		pass: ''
	},
	user_game: {
		nick: 'Hex-game',
		user: 'Hex',
		real: 'The Hexidecimal game bot',
		pass: ''
	},
	server: {
		addr: 'irc.x10hosting.com',
		port: 6667
	},
	twitter: {
		user: 'callumacrae',
		pass: ''
	},
	topic: {
		root: [
			'Welcome! Bienvenue! \xE6\xAD\xA1\xE8\xBF\x8E! Willkommen! Benvenuto! \xEB\xB0\x98\xEA\xB0\x91\xEC\x8A\xB5\xEB\x8B\x88\xEB\x8B\xA4! Seja bem-vindo(a)! Bienvenido!',
			'You are on the x10Hosting chat server!',
			'Have a question? Need support? Just ask!',
			'Follow the rules http://sn.im/ircpolicy'
		],
		seperator: '\xE2\x96\xBA'
	},
	flood: {
		second: 3,
		twenty: 20
	},
	log: {
		file: 'logs/%Y%M%D.log',
		web: {
			chans: [
				'#x10hosting',
				'#cjasdklj'
			],
			port: 9000,
			addr: '192.168.2.102'
		}
	},
	tmp: {}
}

module.exports = config;