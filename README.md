# bitburner
This is all work in progress, only a few of my scripts will be deployed
They are also just going to be deployed, if I think, that they are some kind of working

# const.js
>**RAM usage:** *1.60 GB*

This script just has a few constants defined, which are needed in some scripts


# weaken.js
>**RAM usage:** *1.80 GB*

Simple weaken script with a hostname as argument


# grow.js
>**RAM usage:** *1.80 GB*

Simple grow script with a hostname as argument


# hack.js
>**RAM usage:** *1.75 GB*

Simple hack script with a hostname as argument


# utils.js
>**RAM usage:** *11.95 GB*

This script defines 2 classes

**PlayerDetails**: defines some basic information like how many .exe-files are available at the moment

**ServerList**: collects all servers and collects some details about them


# root.js
>**RAM usage:** *12.00 GB*

This script defines a class with functionallity to root one or all servers


# bot.js
>**RAM usage:** *5.75 GB*

This script is meant to be deployed on all server except home

It listens to ports to get their action (weaken, grow, hack) to call the action for a specific target


# watcher.js
>**RAM usage:** *15.95 GB*

This script coordinates the bot.js activities

It runs through the list of servers deploys deployable scripts, runs the bot.js and prioritizes weaken tasks, then grow and hack
Hacks are sorted by the target's efficiency (money/s per hack)
If both priorities from above don't result in anything, just perform some weaken and hack (for gaining exp)


# serverpurchase.js
>**RAM usage:** *13.45 GB*

This script runs through purchased servers (as long as the maximum amount of purchasable servers isn't reached)
runs the bot.js on them and also upgrades them if possible


# sidebar.js
>**RAM usage:** *28.20 GB*

This script lets you add new items to the sidebar menu.

2 arguments are needed, the first one is the item's name and the second one is a script to call.


# dragndrop.js
>**RAM usage:** *1.60 GB*

This script contains a function to make a HTML element draggable
it needs a container which is the one where the functionallity should have an effect and the actual draggable container


# css.js
>**RAM usage:** *1.60 GB*

This script is by far not finished yet, it includes a function to print some CSS


# browser.js
>**RAM usage:** *X.XX GB*

This script is by far not finished yet, but works with the current functions


# startup.js
>**RAM usage:** *5.15 GB*

This script runs as long a script for buying hacknets is not running, watcher.js is not running and browser.js wasn't added to the sidebar
So this just starts some "main" scripts
