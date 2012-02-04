<?php

// RELOAD MODULE - Bot Admins Only
// Pulls the latest version of the bot from the git repository. Any updates to
// the modules will be instantly updated to the bot.

if ($cmdl == 'x10bot:' && $subcmdl == 'reload') {
    exec("cd /home/admin/x10bot;git pull");
    $this->reply("The bot has been made up-to-date with the GIT repository. Modules have been updated.");
}