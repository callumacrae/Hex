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


## Contributing ##

If you wish to contribute to Hex, run it past me first. If you're adding a
feature, you'll want to confirm with me that Hex actually needs that feature.
If you're fixing a bug, it is less important. File an issue on GitHub, and say
that you're fixing it - this lets everyone else know that you're fixing it, so
that they don't fix it themselves.


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
Basic description of the commit.

Longer description of what the commit does and how it does it. Can wrap
multiple lines. The commit message should not be any longer than 79 characters
wide at any point - you editor should do this for you, anyway. Second line
should remain empty.
```

I should be able to tell exactly what the commit does without reading the
diff - a commit message can never be too long!

If you notice an error in a previous commit which you haven't pushed yet,
amend it instead of making a new commit.
