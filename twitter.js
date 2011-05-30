var http = require('http');

function Twitter(options, track)
{
	var user, pass, authstring,
		__self, req, emitter, tweet;
	__self = this;
	emitter  = new process.EventEmitter()
	authstring = (new Buffer(options.user + ':' + options.pass, 'ascii')).toString('base64');

	options = {
		host: 'stream.twitter.com',
		port: 80,
		path: '/1/statuses/filter.json',
		method: 'POST',
		headers: {
			'Authorization': 'Basic ' + authstring,
			'Host': 'stream.twitter.com',
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};

	req = http.request(options, function(res)
	{
		if (res.statusCode === 200)
		{
			emitter.emit('connected');
			res.setEncoding('utf8');
			res.on('data', function(chunk)
			{
				chunk = /"text":"((?:\\.|[^"])+)",/gm.exec(chunk);
				if (chunk)
				{
					tweet = chunk[1].replace(/\\/g, '');
					emitter.emit('tweet', tweet);
				}
			});
		}
		else
		{
			emitter.emit('error', res.statusCode);
		}
	});

	this.on = function(event, callback)
	{
		callback = callback.bind(this);
		emitter.addListener(event, callback);
	}

	//start request
	req.end(track, 'ascii');
}

module.exports = Twitter;