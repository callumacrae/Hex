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
