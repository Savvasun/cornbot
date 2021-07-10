'use strict';

// Keeps bot alive using a small app that is pinged by UptimeRobot.
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`app listening at http://localhost:${port}`));

// Initializes libs and variables for the program.
const Discord = require('discord.js');
const fs = require('fs');
const discord = new Discord.Client();
require('dotenv').config();
var data;
var defaultPrefix = '$';

discord.login(process.env.token_dev); // CHANGE TO MAIN TOKEN EACH MERGE

// Is triggered when the bot is up and running.
discord.on('ready', () => {
  console.log(`logged in as ${discord.user.tag}\nprefix set to '${defaultPrefix}'`);
});

// Is triggered whenever a message is sent.
discord.on('message', message => {
    var dataF = fs.readFileSync("data/people.json"),
        ratingF = fs.readFileSync("data/ratings.txt"),
        helpF = fs.readFileSync("data/help.txt"),
        seduceF = fs.readFileSync("data/pickupLines.txt");

    function Send(string) {
        message.channel.send(string);
    }

    // Checks if the prefix is used.
    if (!message.content.startsWith(defaultPrefix) || message.author.bot){
        if (!message.author.bot ) {
            if (message.content.toLowerCase() == "uwu" || message.content.toLowerCase() == "owo") Send("uwu");
        }
        return;
    }

    // More variables.
    const all = message.content.slice(defaultPrefix.length).trim().split(' ');
    const command = all[0].toLowerCase()
    const arg = all[1]
    data = JSON.parse(dataF);
    var mems = data.members;

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

            Send(string.includes("@here") || string.includes("@everyone") ? `don't try to fool me` : string);
            break;
            
        case ("candy") :
            // Currently keeping this empy since it is spaghetti code and would be best if it was rewritten later.
            
        case ("prefix") :
            // The prefix command changes the prefix for the bot.
            prefix = arg;
            Send(`Prefix was set to: ${prefix}`);
            break;

        case ("changedata") :
            // Changes an entry in people.json.
            for (var i=0;i<mems.length;i++){
                if (arg != mems[i].name && i == mems.length-1) Send(`No entry with such name, use \`$dataadd\` to add entries`);
                if (arg == mems[i].name) {
                    mems[i].value = all[2];
                    Send(`Entry with name of ${mems[i].name} changed to value of ${all[2]}`);

                    fs.writeFileSync(".\\data\\people.json", JSON.stringify(data));
                    return;
                }
            }
            break;

        case ("adddata") :
            // Add an entry in people.json
            function eAdd(){
                mems.push(
                {
                    name:arg,
                    value:all[2]
                }
                );
                Send(`Entry with name of ${arg} and value of ${all[2]} has been added`);
                fs.writeFileSync(".\\data\\people.json", JSON.stringify(data));
            }
            if (mems.length > 0){
                for(var i=0;i<mems.length;i++){
                    if (mems[i].name == arg) Send('This person is already in the file');
                    if (arg != mems[i].name && i == mems.length-1){
                        eAdd();
                        return;
                    }
                }
            }
            else {
                eAdd();
            }
            break;

        case ("removedata") :
            // Removes entry with specified name.
            for(var i=0;i<mems.length;i++){
                if (arg != mems[i].name && i == mems.length-1) Send(`Couldn't find entry with that name`);
                if (arg == mems[i].name){
                    mems.splice(i, i);
                    Send(`Entry with name of ${arg} was removed`);

                    fs.writeFileSync(".\\data\\people.json", JSON.stringify(data));
                    return;
                }
            }
            break;
            
        case ("showdata") :
            // Shows the data in people.json in a readable text message.
            var message_ = [];
            var message__ = ``;

            if (mems.length > 0){
                for (var i=0;i<mems.length;i++){
                    message_.push(`**name**: ${mems[i].name}, **value**: ${mems[i].value} \n`);
                }
            }
            else {
                Send(`There is no data in the file.`);
            }

            message__ = message_.join('\n');
            Send(message__);
            break;

        case ("datareset") :
            // The data reset command resets the variable and JSON file. Only people with "Staff" role can use it.
            if (message.member.roles.cache.some(role => role.name == 'Staff')){
                data = {
                    members: []
                }
                fs.writeFileSync(".\\data\\people.json", JSON.stringify(data));
                Send(`Data has been reset.`);
                break;
            }
            else {
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