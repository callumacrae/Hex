var config = {
	user: {
		nick: 'x10Bot',
		user: 'x10Bot',
		real: 'Hexidecimal',
		pass: 'leetx10'
	},
	server: {
		addr: 'irc.x10hosting.com',
		port: 6667
	},
	twitter: {
		user: '',
		pass: ''
	},
	flood: {
		second: 4,
		twenty: 20
	},
	log: {
		file: 'logs/%Y%M%D.log',
		web: {
			chans: [
				'#x10hosting',
				'#x10bot',
				'#x10bot-backend'
			],
			port: 9000,
			addr: '0.0.0.0'
		}
	},
	tmp: {}
}

module.exports = config;
