<?php

class IRCBot_Helper {
	public static function bitly ($url) {
		global $config;		
                // Retrieve the resulting XML document
                $result = json_decode(file_get_contents("http://api.bit.ly/shorten?version=2.0.1&longUrl=".urlencode($url)."&login={$config['url']['user']}&apiKey={$config['url']['api_key']}&format=json"));
		return $result->results->$url->shortUrl;
	}
}

