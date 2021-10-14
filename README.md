# screeps-bot
Just your average (sorta bad) bot for [screeps](https://screeps.com/).

# How to use it
Requires npm
1. Download the code.
2. Run `npm install` to download dependancies into the file.
3. Change "screeps-example.json" to "screeps.json", configure it to fit your needs.
4. Run `rollup -c` to only compile your code into the "dist" folder. Or run `rollup -c --environment DEST:main` (switch main to pserver if using a private server configuration) to compile AND upload your code to the server automatically.
6. It should be working. Have fun!
