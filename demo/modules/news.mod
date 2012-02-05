<?php

class news {
	private $bot;
	private $log;

	public function __construct ($bot, $log) {
		$this->bot = $bot;
		$this->log = $log;
	}

	public static function info () {
		return array(
			'name' => 'News Module',
			'desc' => 'Displays the latest x10Hosting news from a staff member, vBulletin or Tumblr',
			'author' => 'Dead-i',
			'version' => '1.0.0',
			'access' => 2,
			'hooks' => array(
				'on_message_received' => 'parse_message',
			),
		);
	}

	public function parse_message ($hook, $data) {
		if ($data['cmd'] == 'x10bot' && $data['subcmd'] == 'news') {
                    global $news;
		    $this->log->info("Received news command from {$data['nick']}", 'news', 'main');
                    if (isset($news) && !empty($news)) {
                        
                        $this->bot->msg($data['chan'], "{$data['nick']}: {$this->bot->news}");
                        
                    }else{
                        
                        // Retrieve the vBulletin RSS feed
                        $vbrss = new SimpleXMLElement("http://x10hosting.com/forums/external.php?type=RSS2&forumids=2", null, true);
                        $vbrss = $vbrss->xpath('channel/item');
                        
                        // Retrieve the Tumblr RSS feed
                        $trrss = new SimpleXMLElement("http://status.x10hosting.com/rss", null, true);
                        $trrss = $trrss->xpath('channel/item');
                        
                        // Parse the PubDates to find the latest one
                        $vbrssdate = explode(" ", $vbrss[0]->pubDate);
                        $trrssdate = explode(" ", $trrss[0]->pubDate);
                            
                        // Translate month names to month numbers
                        $vbrssdate[2] = date("m", strtotime($vbrssdate[2]));
                        $trrssdate[2] = date("m", strtotime($trrssdate[2]));
                        
                        // Remove the unnecessary time separations
                        $vbrssdate[4] = str_replace(":", "", $vbrssdate[4]);
                        $trrssdate[4] = str_replace(":", "", $trrssdate[4]);
                        
                        // Use the final time data to find the latest one
                        if ($vbrssdate[3].$vbrssdate[2].$vbrssdate[1].$vbrssdate[4] <= $trrssdate[3].$trrssdate[2].$trrssdate[1].$trrssdate[4]) {
                            $this->bot->msg($data['chan'], "{$data['nick']}: ".chr(2).$trrss[0]->title.chr(2)." - More: ".$this->bot->bitly($trrss[0]->link));
                        }else{
                            $this->bot->msg($data['chan'], "{$data['nick']}: ".chr(2).$vbrss[0]->title.chr(2)." - More: ".$this->bot->bitly($vbrss[0]->link));
                        }
                        
                    }
		    return true;
		}elseif ($data['cmd'] == 'x10bot' && $data['subcmd'] == 'setnews') {
                    global $news;
		    $msgcontent = explode("{$data['cmd']} {$data['subcmd']}", $this->bot->data);
                    $news = $msgcontent[1];
                    $this->log->info("Received setnews command from {$data['nick']}", 'news', 'main');
                    $this->bot->msg($data['chan'], "{$data['nick']}: News has been set. To unset, please use: x10bot unsetnews");
		    return true;
		}elseif ($data['cmd'] == 'x10bot' && $data['subcmd'] == 'unsetnews') {
                    global $news;
                    $news = '';
                    $this->log->info("Received unsetnews command from {$data['nick']}", 'news', 'main');
                    $this->bot->msg($data['chan'], "{$data['nick']}: News has been unset, and will now be pulled from the forums and status blog.");
		    return true;
                }
	}
}



