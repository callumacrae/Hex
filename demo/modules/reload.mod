<?php

// RELOAD MODULE - Bot Admins Only
// Pulls the latest version of the bot from the git repository. Any updates to
// the modules will be instantly updated to the bot.

if ($cmd == 'x10bot:' && $subcmd == 'reload') {
	$this->log->info("Received reload command from {$usernick}", 'reload', 'main');
    exec("cd /home/admin/x10bot;git pull");
    $this->msg($ex[2], "{$usernick}: The bot has been made up-to-date with the GIT repository. Modules have been updated.");
}

