/*
 * plugin tracks individual elo scores
 * 
 */

const room = HBInit();

room.pluginSpec = {
    name: `hk/solo`,
    author: `hk`,
    version: `1.0.0`,
    dependencies: [
        `sav/commands`,
    ],
    config: {
        url: "",
    },
};

var colors = {
    red: "0xff0000",
    gold: "0xffdc72",
    blue: "0X87CEFA"
};

var reportEnabled = false;
var matchData = {};
var manualRedScore = 0;
var manualBlueScore = 0;

room.onPlayerJoin = (player) => {
    var message1 = "Welcome to the SPHB Elo room.  Match data from 4v4 matches on this server will be sent to a google spreadsheet"
    var message2 = "https://docs.google.com/spreadsheets/d/117Zt6KILkA909JhajGcrYM9Vcel6It-5tPrWI54cvsk/"
    room.sendAnnouncement(message1, player.id, colors.gold);
    room.sendAnnouncement(message2, player.id, colors.gold);
}

room.onCommand_link = (player) => {
    var message2 = "https://docs.google.com/spreadsheets/d/117Zt6KILkA909JhajGcrYM9Vcel6It-5tPrWI54cvsk/"
    room.sendAnnouncement(message2, player.id, colors.gold);
}

function sendMatchData(userName, content) {
    var xhr = new XMLHttpRequest();
    var webhook_url = room.getConfig().url;
    xhr.open('POST', webhook_url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            room.sendChat(xhr.response);
            console.log(xhr.response);
        }
    };
    var data = JSON.stringify({
        "username": userName,
        "content": JSON.stringify(content)
    });
    xhr.send(data);
}

// Function creates an array of each team
// If there are four players on each side, activate reportEnabled and push the array to matchData
function getTeams() {
    var players = room.getPlayerList();
    var redTeam = [];
    var blueTeam = [];
    players.forEach((element) => (element.team === 1 && redTeam.push(element.name)));
    players.forEach((element) => (element.team === 2 && blueTeam.push(element.name)));
    if (redTeam.length == 4 && blueTeam.length == 4) {
        reportEnabled = true;
        matchData.redTeam = redTeam;
        matchData.blueTeam = blueTeam;
    }   
}

//On Game Start, call getTeams
//Send a message to players if match won't be recorded
room.onGameStart = (player) => {
    getTeams();
    if (!reportEnabled) {
        var message = "Match is not 4v4. Game will not be reported to the server.";
        room.sendAnnouncement(message, null, colors.gold);
    }
};

room.onTeamVictory = () => {
    if (reportEnabled) {
        scores = room.getScores();
        matchData.red = scores.red;
        matchData.blue = scores.blue;
        matchData.formtype = "solo-ladder-match";
        sendMatchData("Solo Ladder Match Report", matchData);
        room.sendAnnouncement(JSON.stringify(matchData));
        cleanUp();
    }
};

//send a report for manual verification, flag player.
room.onGameStop = () => {
    if (reportEnabled) {
        matchData.red = manualRedScore;
        matchData.blue = manualBlueScore;
        matchData.formtype = "solo-ladder-manual"
        sendMatchData("Manual Report", matchData);
        room.sendAnnouncement(JSON.stringify(matchData));
        cleanUp();
    }
};

function cleanUp() {
    manualRedScore = 0;
    manualBlueScore = 0;
    reportEnabled = false;
    for (var x in matchData) if (matchData.hasOwnProperty(x)) delete matchData[x];
}

room.onTeamGoal = (team) => {
    if (team == 1) {
        manualRedScore++;
    } else {
        manualBlueScore++;
    }
}