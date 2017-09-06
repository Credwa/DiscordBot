const Discord = require("discord.js");
const client = new Discord.Client();
const guild = new Discord.Guild();
const variablesInterface = require('./token.js');
let token = variablesInterface.variablesInt();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

let commands = {
    vote: new RegExp(/^vote$/i),
    startvoting: new RegExp(/^startvoting$/i),
    help: new RegExp(/^help$/i),
    see: new RegExp(/^see$/i)
},
    comms = commands.commandsArr,
    currentVotes = {
        mon: {
            number: 0,
            names: new Set()
        },
        tue: {
            number: 0,
            names: new Set()
        },
        wed: {
            number: 0,
            names: new Set()
        },
        thu: {
            number: 0,
            names: new Set()
        },
        fri: {
            number: 0,
            names: new Set()
        },
        sat: {
            number: 0,
            names: new Set()
        },
        sun: {
            number: 0,
            names: new Set()
        },
    },
    voterList = new Set(),
    availableVoteDays = [new RegExp(/^mon$/i), new RegExp(/^tue$/i), new RegExp(/^wed$/i), new RegExp(/^thu$/i), new RegExp(/^fri$/i), new RegExp(/^sat$/i), new RegExp(/^sun$/i)];

let isDayValid = function (day) {
    let result = false;
    for (let k = 0; k < availableVoteDays.length; k++) {
        let days = availableVoteDays[k];
        if (availableVoteDays[k].test(day)) {
            result = true;
        }
    }
    return result;
}

let voteCommand = function (msg) {
    if (comms.length <= 2) {
        msg.reply('Please put the days you want to vote separated by spaces e.g "!haki vote tue mon fri"');
    } else {
        let user = client.fetchUser(msg.author.id),
            guild = client.guilds.get(msg.guild.id),
            voter = guild.members.get(msg.author.id),
            voteSuccessReply = '',
            invalidVotes = '',
            setVotes = function () {
                for (let k = 2; k < comms.length; k++) {
                    if (isDayValid(comms[k])) {
                        if (!currentVotes[comms[k]].names.has(voter)) {
                            currentVotes[comms[k]].number++;
                            currentVotes[comms[k]].names.add(voter);
                            voteSuccessReply = voteSuccessReply + ' ' + comms[k].toUpperCase();
                        }
                    } else {
                        invalidVotes = invalidVotes + comms[k];
                    }
                }
                voterList.add(voter);
                if (invalidVotes === null) {
                    msg.reply('The Day' + invalidVotes + ' was not valid. Valid votes went through. You can always vote again to fix it :)');
                } else {
                    msg.reply('Congratz! You voted perfectly for the day(s)' + voteSuccessReply + ' Hope to see you on the fields of war!');
                }
            };
        if (!voterList.has(voter)) {
            setVotes();
        } else {
            msg.reply('You voted before but luckily i\'m so nice I made a little edit to your vote days <3');
            for (var k in currentVotes) {
                if (currentVotes.hasOwnProperty(k)) {
                    if (currentVotes[k].names.has(voter)) {
                        currentVotes[k].number--;
                        currentVotes[k].names.delete(voter);
                    }
                }
            }
            setVotes();
        }
    }
}

let startVotingCommand = function (msg) {
    for (var k in currentVotes) {
        if (currentVotes.hasOwnProperty(k)) {
            currentVotes[k].number = 0;
            currentVotes[k].names.clear();
        }
    }
    voterList.clear();
    msg.reply('A New Voting Session Has Begun!');
}

let seeCommand = function (msg) {
    let data = '',
        getNames = function (someSet) {
            let names = [];
            for (let item in someSet) {
                console.log(item)
                names.push(item.displayName);
            }
            return names;
        }
    if (new RegExp(/^all$/i).test(comms[2])) {
        msg.reply(currentVotes.toString());
    } else if (new RegExp(/^min$/i).test(comms[2])) {
        data = `
            Monday : ${currentVotes.mon.number}\n
            Tuesday : ${currentVotes.tue.number}\n
            Wednesday : ${currentVotes.wed.number}\n
            Thursday : ${currentVotes.thu.number}\n
            Friday : ${currentVotes.fri.number}\n
            Saturday : ${currentVotes.sat.number}\n
            Sunday : ${currentVotes.sun.number}\n\n
            Total Unique Voters : ${voterList.size}\n
        `;
    } else if (new RegExp(/^names$/i).test(comms[2])) {
        getNames(voterList);
    }
    msg.reply (data);
}

let secondCommand = function (msg) {
    if (commands.vote.test(comms[1])) {
        voteCommand(msg);
    } else if (commands.startvoting.test(comms[1])) {
        startVotingCommand(msg);
    } else if (commands.help.test(comms[1])) {

    } else if (commands.see.test(comms[1])) {
        seeCommand(msg);
    } else {
        msg.reply('The Command \"' + comms[1] + '\" was not found');
    }
}

client.on('message', msg => {
    let commandSent = msg.content.split(' ');
    comms = commandSent
    /** Check if first one is starting bot command */
    if (new RegExp(/^!haki$/i).test(comms[0])) {
        secondCommand(msg);
    }
});

client.login(token);