# Commands.md #

A list of available bot commands, and how they are used. May not be
completely up to date, just throw something at one of us on irc or file an
issue if you find any out of date content.

This is in addition to `Hex: help` and `Hex: a help`, as it is more
comprehensive and detailed (and easier to read). It is divided into two
sections; user commands and admin commands.


## User Commands ##

### google ###
**Aliases:** g

```
Hex: google [ <search> ]
```

Replies with a link to google with the specified search.

```irc
<callumacrae> Hex: google Yes & No
<@Hex> callumacrae: http://google.com/search?q=Yes%20%26%20No
<callumacrae> Hex: google
<@Hex> callumacrae: http://google.com/
```


### javascript ###
**Aliases:** js

```
Hex: js <code>
```

Execute the specified JavaScript and returns the value / error.

```irc
12:52 <callumacrae> Hex: js 2 + 4
12:52 <Hex> callumacrae: 6
```


### lmgtfy ###
**Aliases:** None

```
Hex: lmgtfy [ <search> ]
```

Exactly the same as the google command, but links to lmgtfy (Let Me Google
That For You) instead.

```irc
<callumacrae> Hex: lmgtfy Yes & No
<@Hex> callumacrae: http://lmgtfy.com/?q=Yes%20%26%20No
<callumacrae> hex: lmgtfy
<@Hex> callumacrae: http://lmgtfy.com/
```


### login ###
**Aliases:** None

```
Hex: login
```

Logs the user in as an admin, instead of them having to cycle.

```irc
<callumacrae> Hex: login
<@Hex> callumacrae: You have been identified as an admin.
```


### uptime ###
**Aliases:** None

```
Hex: uptime
```

Outputs the uptime of the bot.

```irc
<callumacrae> Hex: uptime
<@Hex> callumacrae: Uptime: 4 days, 7 hours, 11 minutes and 4 seconds.
```


### regex ###
**Aliases:** None

```
Hex: regex <pattern> <string>
```

Tests the specified regular expression (regex) against the specified string.
The regex cannot contain spaces, but the string can.

```irc
<callumacrae> hex regex ([c-d])[b-e]+ abcdefg
<@Hex> callumacrae: 'cde', 'c'
```


### wiki ###
**Aliases:** w

```
Hex: wiki <search>
```

Searches the [x10hosting wiki](http://x10hosting.com/wiki/Main_Page) for the specified input.

```irc
<callumacrae> hex: w High Resource Usage
<@Hex> callumacrae: http://x10hosting.com/wiki/High_Resource_Usage
<callumacrae> hex: w doesntexist
<@Hex> callumacrae: http://x10hosting.com/wiki/index.php?title=Special%3ASearch&search=doesntexist
```


### wolframalpha ###
**Aliases:** wa, wolfram

```
Hex: wolframalpha [ <search> ]
```

Searches wolframalpha for the specified string.

```irc
<callumacrae> hex wa y=x^2+1
<@Hex> callumacrae: http://www.wolframalpha.com/input/?i=y%3Dx%5E2%2B1
<callumacrae> hex wa
<@Hex> callumacrae: http://www.wolframalpha.com/
```


### whoami ###
**Aliases:** None

```
Hex: whoami
```

Returns who the bot thinks you are (your nick, your hostmask, and your
admin level).

```irc
<callumacrae> hex whoami
<Hex> callumacrae: Your nick is "callumacrae". Your hostmask is
            "lynxphp.com". You are admin level 10000.
```


### Static Commands ###

There are also some other commands that can be called that are not
hard-coded. These can be set and destroyed through the bot, and may
change at any time. The below list contains most of them, as of 16/	02/12.

* **about:** Returns some information about the bot.
* **bugdomain:** Links the user to the domain purchase page.
* **cpanel:**  Tells the user how to access their cPanel. *Alias: cp*
* **dns:** Links the user to the x10hosting wiki namservers page.
* **domainadd:** Tells the user how to add their own domain to their account.
* **flushdns:** Links the user to the kb page on how to flush their DNS.
* **h:** Tells the user to just ask the question, instead of asking to ask.
* **help:** Returns a list of available commands.
* **mysql:** Tells the user how to access their MySQL database.
* **paid:** Tells the user how to upgrade to premium. *Alias: upgrade.*
* **password:** Tells the user to check their spam folder. *Alias: pass*
* **ping:** Shouts PONG at the user.
* **tickets:** Tells the user how to create a ticket.
* **tos:** Links the user to the ToS.



## Admin Commands ##

Admin commands can be accessed by appending the command with "admin "
or "a ". For example:

```irc
<callumacrae> Hex: a ban Dead-i
```

They require the user calling them to be of a certain admin level (specified
below the commands below by "Level"). Failing to be of that level will result
in an error (or if they're not an admin at all, it will fail silently).


### help ###
**Aliases:** h
**Level:** 0

```
Hex: a help [ all ]
```

Sends the user a list of admin commands that they can use, or if they
specify "all", it gives them more detail about each command (but it doesn't
contain quite as much detail as this document).

It is sent in multiple private messages, not into the channel you requested
it in (assuming you requested it in a channel).


### ban ###
**Aliases:** None
**Level:** 4

```
Hex: a ban <user> [ <channel >]
```

Bans the specified user from either the current channel or the specified
channel; if a channel is not specified, it will ban the user from the
current channel.


### devoice ###
**Aliases:** None
**Level:** 2

```
Hex: a devoice <user> [ <channel> ]
```

Devoices the specified user in either the current channel or the specified
channel; if the channel is not specified, it will devoice the user in the
current channel.


### flush ###
**Aliases:** None
**Level:** 0 (not harmful)

```
Hex: a flush
```

Reloads handler.js, causing any updates in that file to be applied.


### join ###
**Aliases:** None
**Level:** 7

```
Hex: a join <channel>
```

Commands the bot to join the specified channel. If it is banned from that
channel, it will *not* try to join the channel again or try to unban itself, it
just won't join.


### kick ###
**Aliases:** None
**Level:** 3

```
Hex: a kick <user> [ <channel> ]
```

Kicks the specified user from either the current channel or the specified
channel; if the channel is not specified, it will kick the user from the
current channel. This command does not ban the user, and they will be able
to rejoin immediately.


### mute ###
**Aliases:** None
**Level:** 6

```
Hex: a mute
```

Mutes the bot in the current channel. Use the `unmute` command to unmute
the bot, or `tmpmute` if you only want to mute the bot for a period of time.


### part ###
**Aliases:** None
**Level:** 7

```
Hex: a part [ <channel> ]
```

Commands the bot to part either the current channel or the specified
channel; if the channel is not specified, it will part the current channel.


### restart ###
**Aliases:** quit, q
**Level:** 10

```
Hex: a restart
```

Restarts the bot. It is not possible to quit the bot without access to the
server.


### raw ###
**Aliases:** None
**Level:** 10

```
Hex: a raw <text>
```

Sends the specified text as raw IRC (equivilant to client /quote).


### remove ###
**Aliases:** rm
**Level:** 6

```
Hex: a rm <command>
```

Removes the specified command. Use `set` to modify or add a command.


### set ###
**Aliases**: None
**Level:** 6

```
Hex: a set <command> <text>
```

Sets the specified command to the specified text.


### su add ###
**Aliases:** su add
**Level:** 10

```
Hex: a su add <user> <level>
```

Adds the specified user as a super user of the specified level.


### su remove ###
**Aliases:** su rm
**Level:** 10

```
Hex: a su remove <user>
```

Removes the super user permissions of the specified user.


### su list ###
**Aliases:** None
**Level:** 3

```
Hex: a su list
```

Sends a list of super users, their levels, and whether they're logged into the
bot or not in a private message to the user who requested it.


### tmpmute ###
**Aliases:** None
**Level:** 4

```
Hex: a tmpmute
```

Mutes the bot in the current channel for half an hour.


### unmute ###
**Aliases:** None
**Level:** 4

```
Hex: a unmute
```

Unmutes the bot in the current channel. It can unmute mutes set with both
`mute` and `tmpmute`.


### voice ###
**Aliases:** None
**Level:** 2

```
Hex: a voice <user> [ <channel> ]
```

Voices the specified user in either the current channel or the specified
channel; if the channel is not specified, it will voice the user in the
current channel.
