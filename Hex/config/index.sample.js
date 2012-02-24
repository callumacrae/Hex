var config = {
	user: {
		nick: 'Hex',
		user: 'Hex',
		real: 'Hexidecimal',
		pass: ''
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
			addr: '192.168.2.102'
		}
	},
	tmp: {}
}

module.exports = config;
