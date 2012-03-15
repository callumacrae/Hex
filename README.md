# Hexidecimal IRC bot ##

An IRC bot for the x10hosting IRC written completely in Node.js

## Installation ##

To install, copy `config/index.sample.js` to `config/index.js` and modify
the necessary config settings.


## Usage ##

To run the bot (once you have installed it), use either of these two commands:

```
nohup node hex.js >> log &
supervisor --watch README hex.js >> log &
```

Run them from inside the Hex directory.


## Demo Bot ##

There is a small bot written in PHP in /demo/. It's not used, and is just there
for reference.


## Contributing ##

If you wish to contribute to Hex, run it past me first. If you're adding a
feature, you'll want to confirm with me that Hex actually needs that feature.
If you're fixing a bug, it is less important. File an issue on GitHub, and say
that you're fixing it - this lets everyone else know that you're fixing it, so
that they don't fix it themselves.


### IRC ###

We're on IRC (obviously); go to #x10bot on irc.x10hosting.com. Standard
ports and stuff.


### Coding Standards ###

Most of this is fairly obvious - look at `hex.js` and `handler.js`, and copy
the coding standards used in there. A basic summary:

* Curly brackets on the same line, with white space in the normal places.
* Space before the parenthesis on function expressions, but not function declerations.
* Semi-colons everywhere! (except after function declerations)
* Single quotes only, please.
* No micro-optimisations. It's a robot.


### Committing ###

Only a few guidelines here. Commits should use the following syntax:

```
[issue/#] Basic description of the commit.

Longer description of what the commit does and how it does it. Can wrap
multiple lines. The commit message should not be any longer than 79 characters
wide at any point - you editor should do this for you, anyway. Second line
should remain empty.

ref #ticketnumber
```

I should be able to tell exactly what the commit does without reading the
diff - a commit message can never be too long!

If you notice an error in a previous commit which you haven't pushed yet,
amend it instead of making a new commit.

So an example commit:

```
[issue/19] Fixed a bug where blank wiki command would link nowhere.

Now it links to the wiki main page.

ref #19
```

#### Branching ####

Every issue should have its own branch; branch the master branch, make
changes, send a pull request. This means that you can continue working
on something else while your pull request is waiting to be merged.


### Contributors ###

* **callumacrae** - GIT Janitor
* **Dead-i** - Server Slave
* **GtoXic** - Server Admin
* **xav0989** - Awesome Coder
* **Sharky** - THE NOOB
* **The Weather Guy** - That guy
* **Sierra** - Administrative Suspendotron of many names
* **stpvoice** - The VOICE of Silver, Turquoise and Purple
* **zachary** - The Bot Whisperer
