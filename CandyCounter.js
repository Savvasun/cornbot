'use strict';

// Keeps bot alive using a small app that is pinged by UptimeRobot.
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));


// Initializes libs and variables for the program.
const Discord = require('discord.js');
const fs = require('fs');
const discord = new Discord.Client();
require('dotenv').config();
var staff = process.env.staff.split(' ');
var data;
var defaultPrefix = '$';

// Is triggered when the bot is up and running.
discord.on('ready', () => {
  console.log(`online`);
});

// Is triggered whenever a message is sent.
discord.on('message', message => {
    var dataF = fs.readFileSync("data/people.json")
    var ratingF = fs.readFileSync("data/ratings.txt");
    var helpF = fs.readFileSync("data/help.txt");
    var seduceF = fs.readFileSync("data/pickupLines.txt");

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
    data = JSON.parse(dataF);

    // Checks what command was used.
    switch (command) {
        case ("help") :
            // Sends contents of the help text file.
            Send(`${helpF.toString()}`);
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

        case ("data") :
            // Changes an entry in people.json.
            for (var i=0;i<data.members.length;i++){
                if (arg != data.members[i].name && i >= data.members.length-1){
                    Send(`there isn't a person with that name in the file`);
                    break;
                }
                if (arg == data.members[i].name) {
                    data.members[i].pogness = all[2];
                    Send(`Entry with name of ${data.members[i].name} with value of ${all[2]}`);

                    fs.writeFileSync(".\\data\\people.json", JSON.stringify(data));
                    break;
                }
            }
            break;

        case ("showdata") :
            // Shows the data in people.json in a readable text message.
            var message_ = [];
            var message__ = ``;

            if (data.members.length > 0){
                for (var i=0;i<data.members.length;i++){
                    message_.push(`**name**: ${data.members[i].name}, **value**: ${data.members[i].pogness} \n`);
                }
            }
            else {
                Send(`There is no data in the file.`);
            }

            message__ = message_.join('\n');
            Send(message__);
            break;

        case ("datareset") :
            // The data reset command resets the variable and JSON file. Only I can use this command lmao.
            if (staff.includes(message.author.username)){
                data = {
                    members: []
                }
                fs.writeFileSync(".\\data\\people.json", JSON.stringify(data));
                Send(`Data has been reset.`);
                break;
            }
            else {
                // Makes fun of you.
                Send(`u aren't staff`);
                break;
            }

        case ("seduce") :
            // Spits out a random pickup line from the pickupLines.txt text file.
            var lineID = 0;
            var lines = seduceF.toString().split('\n');
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

            ratings = ratingF.toString().split('\n');
            
            for (var i=0;i<ratings.length;i++){
                yRating = ratings[i].split(' ');

                if (!yRating.includes(arg) && i >= ratings.length-1){
                    Send(`this person is too cool`);
                    return;
                }
                if (yRating.includes(arg)){
                    Send(ratings[i]);
                    return;
                }
            }
            break;      
    }
});

discord.login(process.env.token_dev); // CHANGE TO MAIN TOKEN EACH MERGE