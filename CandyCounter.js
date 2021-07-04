'use strict';

// Initializes libs and variables for the program.
const Discord = require('discord.js');
const fs = require('fs');
const discord = new Discord.Client();
var data;
var defaultPrefix = '$';

// Various files.
const dataLoc = ".\\people.json";
const helpLoc = ".\\help.txt";
const seduceLoc = ".\\pickupLines.txt";
const ratingLoc = ".\\ratings.txt";
const ratingFile = fs.readFileSync(ratingLoc);
const helpFile = fs.readFileSync(helpLoc);
const seduceFile = fs.readFileSync(seduceLoc);

discord.login('NzUzNjY4Njk4MzcxNTIyNTkw.X1pirA.9JLwpU0tWogOyWdbzG0ot9I5yj8');

// Is triggered when the bot is up and running.
discord.on('ready', () => {
  console.log(`uwu im wweady to stawt wowking uwu`);
});

// Is triggered whenever a message is sent.
discord.on('message', message => {
    function Send(string) {
        message.channel.send(string);
    }

    // Checks if the prefix is used.
    if (!message.content.startsWith(defaultPrefix) || message.author.bot){
        if (!message.author.bot ) {
            if (message.content.toLowerCase() == "uwu" || message.content.toLowerCase() == "owo"){
                Send(`uwu`);
                return;
            }
        }
        return;
    }

    // More variables.
    const all = message.content.slice(defaultPrefix.length).trim().split(' ');
    const command = all[0].toLowerCase()
    const arg = all[1]
    const Name = message.author.username;
    data = JSON.parse(fs.readFileSync(dataLoc));

    // Checks what command was used.
    switch (command) {
        case ("help") :
            // Sends contents of the help text file.
            Send(`${helpFile.toString()}`);
            break;
        
        case ("say") :
            // Spweys out a message based off whatever the user said.

            // TEMPORARY SOLUTION: change to slice after location of command, not fixed number.
            var string = all.slice(1).join(' ');

            Send(string);
            break;
            
        case ("candy") :
            // Currently keeping this empy since it is spaghetti code and would be best if it was rewritten later.
            
        case ("prefix") :
            // The prefix command changes the prefix for the bot.
            prefix = arg;
            Send(`Prefix was set to: ${prefix}`);
            break;

        case ("showdata") :
            // Shows the data in people.json in a readable text message.
            var message_ = [];
            var message__ = ``;

            if (data.members.length > 0){
                for (var i=0;i<data.members.length;i++){
                    message_.push(`**name**: ${data.members[i].name}, **pogness**: ${data.members[i].pogness} \n`);
                }
            }
            else {
                Send(`There is no data in the file dumbass.`);
            }

            message__ = message_.join('\n');
            Send(message__);
            break;

        case ("datareset") :
            // The data reset command resets the variable and JSON file. Only I can use this command lmao.
            if (message.author.username == "sav"){
                data = {
                    members: []
                }
                fs.writeFileSync(dataLoc, JSON.stringify(data));
                Send(`Data has been reset.`);
                break;
            }
            else {
                // Makes fun of you.
                Send(`BRU UR NOT Sav U CANT HAHAHA`);
                break;
            }

        case ("seduce") :
            // Spits out a random pickup line from the pickupLines.txt text file.
            var lineID = 0;
            var lines = seduceFile.toString().split('\n');
            lineID = Math.floor(Math.random() * lines.length);

            Send(lines[lineID]);
            break;

        case ("ping") :
            // Pong!
            Send("pong!");
            break;

        case ("rate") :
            // Rates whoever is in the argument based on ratings.txt.
            var ratings = [];
            var yRating = [];

            ratings = ratingFile.toString().split('\n');

            for (var i=0;i<ratings.length;i++){
                yRating = ratings[i].split(' ');

                if (arg == yRating[0]){
                    Send(ratings[i]);
                }
            }
            break;      
    }
});