//plugin to enable chooseteams, an option to allow room to run without admins
//config
//  timerDuration - length of timer before expiration (in ms)

const room = HBInit();

room.pluginSpec = {
    name: `hk/choose`,
    author: `hk`,
    version: `1.0.0`,
    dependencies: [
        `sav/commands`,
    ],
    config: {
        configTimer: "",
        adminpass: "",
    },
};

var colors = {
    red: "0xff0000",
    gold: "0xffdc72",
    blue: "0X87CEFA"
};

var ninety = `{ "name": "Big Easy 90%ball", "width": 600, "height": 270, "spawnDistance": 350, "bg": { "type": "grass", "width": 550, "height": 240, "kickOffRadius": 80, "cornerRadius": 0 }, "vertexes": [{ "x": -550, "y": 240, "trait": "ballArea" }, { "x": -550, "y": 95, "trait": "ballArea" }, { "x": -550, "y": -95, "trait": "ballArea" }, { "x": -550, "y": -240, "trait": "ballArea" }, { "x": 550, "y": 240, "trait": "ballArea" }, { "x": 550, "y": 95, "trait": "ballArea" }, { "x": 550, "y": -95, "trait": "ballArea" }, { "x": 550, "y": -240, "trait": "ballArea" }, { "x": 0, "y": 270, "trait": "kickOffBarrier" }, { "x": 0, "y": 80, "trait": "kickOffBarrier" }, { "x": 0, "y": -80, "trait": "kickOffBarrier" }, { "x": 0, "y": -270, "trait": "kickOffBarrier" }, { "x": -560, "y": -95, "trait": "goalNet" }, { "x": -580, "y": -75, "trait": "goalNet" }, { "x": -580, "y": 75, "trait": "goalNet" }, { "x": -560, "y": 95, "trait": "goalNet" }, { "x": 560, "y": -95, "trait": "goalNet" }, { "x": 580, "y": -75, "trait": "goalNet" }, { "x": 580, "y": 75, "trait": "goalNet" }, { "x": 560, "y": 95, "trait": "goalNet" }], "segments": [{ "v0": 0, "v1": 1, "trait": "ballArea" }, { "v0": 2, "v1": 3, "trait": "ballArea" }, { "v0": 4, "v1": 5, "trait": "ballArea" }, { "v0": 6, "v1": 7, "trait": "ballArea" }, { "v0": 12, "v1": 13, "trait": "goalNet", "curve": -90 }, { "v0": 13, "v1": 14, "trait": "goalNet" }, { "v0": 14, "v1": 15, "trait": "goalNet", "curve": -90 }, { "v0": 16, "v1": 17, "trait": "goalNet", "curve": 90 }, { "v0": 17, "v1": 18, "trait": "goalNet" }, { "v0": 18, "v1": 19, "trait": "goalNet", "curve": 90 }, { "v0": 8, "v1": 9, "trait": "kickOffBarrier" }, { "v0": 9, "v1": 10, "trait": "kickOffBarrier", "curve": 180, "cGroup": ["blueKO"] }, { "v0": 9, "v1": 10, "trait": "kickOffBarrier", "curve": -180, "cGroup": ["redKO"] }, { "v0": 10, "v1": 11, "trait": "kickOffBarrier" }], "goals": [{ "p0": [-550, 95], "p1": [-550, -95], "team": "red" }, { "p0": [550, 95], "p1": [550, -95], "team": "blue" }], "discs": [{ "pos": [-550, 95], "trait": "goalPost", "color": "FFCCCC" }, { "pos": [-550, -95], "trait": "goalPost", "color": "FFCCCC" }, { "pos": [550, 95], "trait": "goalPost", "color": "CCCCFF" }, { "pos": [550, -95], "trait": "goalPost", "color": "CCCCFF" }], "planes": [{ "normal": [0, 1], "dist": -240, "trait": "ballArea" }, { "normal": [0, -1], "dist": -240, "trait": "ballArea" }, { "normal": [0, 1], "dist": -270, "bCoef": .1 }, { "normal": [0, -1], "dist": -270, "bCoef": .1 }, { "normal": [1, 0], "dist": -600, "bCoef": .1 }, { "normal": [-1, 0], "dist": -600, "bCoef": .1 }], "traits": { "ballArea": { "vis": false, "bCoef": 1, "cMask": ["ball"] }, "goalPost": { "radius": 8, "invMass": 0, "bCoef": .5 }, "goalNet": { "vis": true, "bCoef": .1, "cMask": ["ball"] }, "kickOffBarrier": { "vis": false, "bCoef": .1, "cGroup": ["redKO", "blueKO"], "cMask": ["red", "blue"] } }, "ballPhysics": { "radius": 9, }, }`;
var eightyfive = `{ "name": "Big Easy 85%ball", "width": 600, "height": 270, "spawnDistance": 350, "bg": { "type": "grass", "width": 550, "height": 240, "kickOffRadius": 80, "cornerRadius": 0 }, "vertexes": [{ "x": -550, "y": 240, "trait": "ballArea" }, { "x": -550, "y": 95, "trait": "ballArea" }, { "x": -550, "y": -95, "trait": "ballArea" }, { "x": -550, "y": -240, "trait": "ballArea" }, { "x": 550, "y": 240, "trait": "ballArea" }, { "x": 550, "y": 95, "trait": "ballArea" }, { "x": 550, "y": -95, "trait": "ballArea" }, { "x": 550, "y": -240, "trait": "ballArea" }, { "x": 0, "y": 270, "trait": "kickOffBarrier" }, { "x": 0, "y": 80, "trait": "kickOffBarrier" }, { "x": 0, "y": -80, "trait": "kickOffBarrier" }, { "x": 0, "y": -270, "trait": "kickOffBarrier" }, { "x": -560, "y": -95, "trait": "goalNet" }, { "x": -580, "y": -75, "trait": "goalNet" }, { "x": -580, "y": 75, "trait": "goalNet" }, { "x": -560, "y": 95, "trait": "goalNet" }, { "x": 560, "y": -95, "trait": "goalNet" }, { "x": 580, "y": -75, "trait": "goalNet" }, { "x": 580, "y": 75, "trait": "goalNet" }, { "x": 560, "y": 95, "trait": "goalNet" }], "segments": [{ "v0": 0, "v1": 1, "trait": "ballArea" }, { "v0": 2, "v1": 3, "trait": "ballArea" }, { "v0": 4, "v1": 5, "trait": "ballArea" }, { "v0": 6, "v1": 7, "trait": "ballArea" }, { "v0": 12, "v1": 13, "trait": "goalNet", "curve": -90 }, { "v0": 13, "v1": 14, "trait": "goalNet" }, { "v0": 14, "v1": 15, "trait": "goalNet", "curve": -90 }, { "v0": 16, "v1": 17, "trait": "goalNet", "curve": 90 }, { "v0": 17, "v1": 18, "trait": "goalNet" }, { "v0": 18, "v1": 19, "trait": "goalNet", "curve": 90 }, { "v0": 8, "v1": 9, "trait": "kickOffBarrier" }, { "v0": 9, "v1": 10, "trait": "kickOffBarrier", "curve": 180, "cGroup": ["blueKO"] }, { "v0": 9, "v1": 10, "trait": "kickOffBarrier", "curve": -180, "cGroup": ["redKO"] }, { "v0": 10, "v1": 11, "trait": "kickOffBarrier" }], "goals": [{ "p0": [-550, 95], "p1": [-550, -95], "team": "red" }, { "p0": [550, 95], "p1": [550, -95], "team": "blue" }], "discs": [{ "pos": [-550, 95], "trait": "goalPost", "color": "FFCCCC" }, { "pos": [-550, -95], "trait": "goalPost", "color": "FFCCCC" }, { "pos": [550, 95], "trait": "goalPost", "color": "CCCCFF" }, { "pos": [550, -95], "trait": "goalPost", "color": "CCCCFF" }], "planes": [{ "normal": [0, 1], "dist": -240, "trait": "ballArea" }, { "normal": [0, -1], "dist": -240, "trait": "ballArea" }, { "normal": [0, 1], "dist": -270, "bCoef": .1 }, { "normal": [0, -1], "dist": -270, "bCoef": .1 }, { "normal": [1, 0], "dist": -600, "bCoef": .1 }, { "normal": [-1, 0], "dist": -600, "bCoef": .1 }], "traits": { "ballArea": { "vis": false, "bCoef": 1, "cMask": ["ball"] }, "goalPost": { "radius": 8, "invMass": 0, "bCoef": .5 }, "goalNet": { "vis": true, "bCoef": .1, "cMask": ["ball"] }, "kickOffBarrier": { "vis": false, "bCoef": .1, "cGroup": ["redKO", "blueKO"], "cMask": ["red", "blue"] } }, "ballPhysics": { "radius": 8.5, }, }`;
var eighty = `{ "name" : "Big Easy 80%ball", "width" : 600, "height" : 270, "spawnDistance" : 350, "bg" : { "type": "grass", "width": 550, "height": 240, "kickOffRadius": 80, "cornerRadius": 0 }, "vertexes" : [{ "x": -550, "y": 240, "trait": "ballArea" }, { "x": -550, "y": 95, "trait": "ballArea" }, { "x": -550, "y": -95, "trait": "ballArea" }, { "x": -550, "y": -240, "trait": "ballArea" }, { "x": 550, "y": 240, "trait": "ballArea" }, { "x": 550, "y": 95, "trait": "ballArea" }, { "x": 550, "y": -95, "trait": "ballArea" }, { "x": 550, "y": -240, "trait": "ballArea" }, { "x": 0, "y": 270, "trait": "kickOffBarrier" }, { "x": 0, "y": 80, "trait": "kickOffBarrier" }, { "x": 0, "y": -80, "trait": "kickOffBarrier" }, { "x": 0, "y": -270, "trait": "kickOffBarrier" }, { "x": -560, "y": -95, "trait": "goalNet" }, { "x": -580, "y": -75, "trait": "goalNet" }, { "x": -580, "y": 75, "trait": "goalNet" }, { "x": -560, "y": 95, "trait": "goalNet" }, { "x": 560, "y": -95, "trait": "goalNet" }, { "x": 580, "y": -75, "trait": "goalNet" }, { "x": 580, "y": 75, "trait": "goalNet" }, { "x": 560, "y": 95, "trait": "goalNet" }], "segments" : [{ "v0": 0, "v1": 1, "trait": "ballArea" }, { "v0": 2, "v1": 3, "trait": "ballArea" }, { "v0": 4, "v1": 5, "trait": "ballArea" }, { "v0": 6, "v1": 7, "trait": "ballArea" }, { "v0": 12, "v1": 13, "trait": "goalNet", "curve": -90 }, { "v0": 13, "v1": 14, "trait": "goalNet" }, { "v0": 14, "v1": 15, "trait": "goalNet", "curve": -90 }, { "v0": 16, "v1": 17, "trait": "goalNet", "curve": 90 }, { "v0": 17, "v1": 18, "trait": "goalNet" }, { "v0": 18, "v1": 19, "trait": "goalNet", "curve": 90 }, { "v0": 8, "v1": 9, "trait": "kickOffBarrier" }, { "v0": 9, "v1": 10, "trait": "kickOffBarrier", "curve": 180, "cGroup": ["blueKO"] }, { "v0": 9, "v1": 10, "trait": "kickOffBarrier", "curve": -180, "cGroup": ["redKO"] }, { "v0": 10, "v1": 11, "trait": "kickOffBarrier" }], "goals" : [{ "p0": [-550, 95], "p1": [-550, -95], "team": "red" }, { "p0": [550, 95], "p1": [550, -95], "team": "blue" }], "discs" : [{ "pos": [-550, 95], "trait": "goalPost", "color": "FFCCCC" }, { "pos": [-550, -95], "trait": "goalPost", "color": "FFCCCC" }, { "pos": [550, 95], "trait": "goalPost", "color": "CCCCFF" }, { "pos": [550, -95], "trait": "goalPost", "color": "CCCCFF" }], "planes" : [{ "normal": [0, 1], "dist": -240, "trait": "ballArea" }, { "normal": [0, -1], "dist": -240, "trait": "ballArea" }, { "normal": [0, 1], "dist": -270, "bCoef": .1 }, { "normal": [0, -1], "dist": -270, "bCoef": .1 }, { "normal": [1, 0], "dist": -600, "bCoef": .1 }, { "normal": [-1, 0], "dist": -600, "bCoef": .1 }], "traits" : { "ballArea" : { "vis": false, "bCoef": 1, "cMask": ["ball"] }, "goalPost" : { "radius": 8, "invMass": 0, "bCoef": .5 }, "goalNet" : { "vis": true, "bCoef": .1, "cMask": ["ball"] }, "kickOffBarrier" : { "vis": false, "bCoef": .1, "cGroup": ["redKO", "blueKO"], "cMask": ["red", "blue"] } }, "ballPhysics" : { "radius": 8,}, }`;

var specs = [];
var red = [];
var blue = [];
var rebootList = [];
var result = 0;
var teamSize = 0;
var expiredTimer = 0;
var setTimer;  
var picking;
var ballSize;
var rebootTimer = 0;
var quorum;
var rebootInterval;

//on team victory, remember who won for onGameStop handler
room.onTeamVictory = (scores) => {
    result = (scores.red > scores.blue) ? 2 : 1;
}

room.onCommand_cleartimer = (player, args) => {
    if (args[0] != room.getConfig().adminpass) {
        return false;
    }
    clearTimer();
    room.sendAnnouncement("[BOT] cleared timer", player.id);
    return false;

}

room.onCommand_ballSize = (player, args) => {
    if (args[0] != room.getConfig().adminpass) {
        return false;
    }
    switch (parseInt(args[1])) {
        case 90:
            ballSize = 90
            room.sendAnnouncement("[BOT] set ball size to 90%")
            break;
        case 85:
            ballSize = 85
            room.sendAnnouncement("[BOT] set ball size to 85%")
            break;
        case 80:
            ballSize = 80
            room.sendAnnouncement("[BOT] set ball size to 80%")
            break;
        default:
            room.sendAnnouncement("[BOT] set ball size to default")
            ballSize = 0;
    }
    return false;

}

room.onGameStop = () => {
    if (result == 0) {
        var message = "[BOT] Game was stopped by Admin.  Auto team pick disabled for this round, select teams manually.  If the room is broken type !reboot."
        room.sendAnnouncement(message, null, colors.red, "bold")
        return false;
    }

    if (result == -1) {
        var message = `[BOT] Room rebooting.  Setting new captains`
        room.sendAnnouncement(message, null, colors.gold)
        return false;
    }

    switch (teamSize){
        case 4:
            var players = room.getPlayerList();
            if (players.length < 12) {
                var message = "[BOT] Not enough players for dynasty";
                room.sendAnnouncement(message, null, colors.red);
                twoCapVictory();
            } else {
                room.sendAnnouncement(message, null, colors.red);
                dynastyVictory(result);
            }
            break;
        case 0:
            var message = "[BOT] There's not enough players to play a game."
            var players = room.getPlayerList();
            for (i = 0; i < players.length; i++) {
                room.setPlayerTeam(players[i].id, 0);
            }
            room.sendAnnouncement(message, null, colors.red);
            break;
        default:
            var message = "[BOT] There's not enough players to run 4v4."
            room.sendAnnouncement(message, null, colors.red);
            twoCapVictory();
            break;
    }

    result = 0;
}

function dynastyVictory(result) {
    //removes players from losing team
    var players = room.getPlayerList();
    for (i = 0; i < players.length; i++) {
        if (players[i].team == result) {
            room.setPlayerTeam(players[i].id, 0);
        }
    }  

    picking = specs[0]
    room.setPlayerTeam(picking, result);
    setTimeout(function () { setPick(picking); }, 100);
}

function twoCapVictory() {
    //removes players from both teams
    var players = room.getPlayerList();
    for (i = 0; i < players.length; i++) {
        if (players[i].team > 0) {
            room.setPlayerTeam(players[i].id, 0);
        }
    }
    setTimeout(function () { twoCapVictoryPartTwo(); }, 100);
}
function twoCapVictoryPartTwo() {
    //set caps, call setPick
    var redCap = specs[0];
    var blueCap = specs[1];
    room.setPlayerTeam(redCap, 1);
    room.setPlayerTeam(blueCap, 2);

    picking = blueCap;
    setTimeout(function () { setPick(blueCap); }, 100);
}

//TODO TIMER FUCNTIONS
room.onCommand_timer = (player) => {
    timer(player.id);
}

room.onCommand_clear = (player) => {
    clearTimer();
}

function timer(playerId) {
    setTimer = setInterval(capTimer, room.getConfig().configTimer, playerId)
}


function capTimer(playerId) {
    expiredTimer++;
    room.sendAnnouncement(`[BOT] You have ${room.getConfig().configTimer / 1000} seconds to pick a player before you are kicked.`, playerId, colors.red)

    switch (expiredTimer){
        case 1:
            listSpecs(playerId);
            break;
        case 2:
            room.kickPlayer(playerId, "time expired", false);
            break;
        default:
            break;
    }
}

function clearTimer() {
    clearInterval(setTimer);
    expiredTimer = 0;
}

room.onPlayerChat = (player, arg) => {
    if (arg.charAt(0) == "@" && player.id == picking) {
        pickPlayer = arg.trim().replace(/_/g, " ").substring(1);
        var players = room.getPlayerList();
        var findPlayer = players.filter(element => element.name == pickPlayer);
        if ((findPlayer[0]) && (findPlayer[0].team == 0)) {
            var team = (player.team == 1) ? "red" : "blue";
            var message = `[BOT] ${findPlayer[0].name} has been picked by ${team}`
            room.sendAnnouncement(message, null, colors.gold);
            room.setPlayerTeam(findPlayer[0].id, player.team);
            clearTimer();
            setTimeout(function () { nextPickHandler(); }, 100);
        } else {
            message = `[BOT]Couldn't find that ${pickPlayer} on specs. Trying picking them by using !pick # (ex. !pick 1)`
            room.sendAnnouncement(message, player.id, colors.red);
            listSpecs(player.id);
        }
    }
}

room.onCommand_pick = (player, args) => {
    if (player.id != picking) {
        var message = "It's not your turn to pick";
        room.sendAnnouncement(message, player.id, colors.red);
        return false;
    }
    var team = (player.id == 1) ? "red" : "blue";
    switch (args.length) {
        case 1:
            var i = parseInt(args[0]);
            if (i <= specs.length && i > 0) {
                var pickedPlayer = room.getPlayer(specs[i - 1]);
                var message = `[BOT] ${pickedPlayer.name} has been picked by ${team}`   
                room.sendAnnouncement(message, null, colors.gold);
                room.setPlayerTeam(pickedPlayer.id, player.team);
                clearTimer();
                setTimeout(function () { nextPickHandler(); }, 100);
            } else if (args[0].toUpperCase() == "RANDOM") {
                var random = Math.floor(Math.random() * specs.length);
                var pickedPlayer = room.getPlayer(specs[random]);
                var message = `[BOT] ${pickedPlayer.name} has been randomly selected by ${team}`
                room.sendAnnouncement(message, null, colors.gold);
                room.setPlayerTeam(pickedPlayer.id, player.team);
                clearTimer();
                setTimeout(function () { nextPickHandler(); }, 100);
            } else {
                var message = `[BOT] Invalid Entry.  Please try again`
                room.sendAnnouncement(message, player.id, colors.red); 
                listSpecs(player.id);
            }
            return false;
            break;
        default:
            listSpecs(player.id);
            return false;
            break;
    }
}

function nextPickHandler() {
    clearTimer();

    if (red.length == 0 && blue.length == 0) {
        return false;
    }

    //Check if teams have too many players
    if (red.length > teamSize) {
        room.setPlayerTeam(red[red.length - 1], 0);
        setTimeout(function () { nextPickHandler(); }, 100);
        return false;
    }
    if (blue.length > teamSize) {
        room.setPlayerTeam(blue[blue.length - 1], 0);
        setTimeout(function () { nextPickHandler(); }, 100);
        return false;
    }

    //Check if teams are done picking
    if (red.length == teamSize && blue.length == teamSize) {
    //if (PLAYERS_IN_ROOM == 8) {
        getMap();
        room.startGame();
        room.pauseGame(false);
        picking = 0;
        return false;
    }

    picking = (blue.length > red.length) ? red[0] : blue[0];
    setPick(picking);
}

function setPick(playerId) {
    timer(playerId);    
    listSpecs(playerId);
}


//on player join, add player to specs
room.onPlayerJoin = (player) => {
    var message = `Welcome, ${player.name}.  This room is automatically run.  In the event that the automatic captain and picking features fail, type !reboot to initiate a vote to reboot the room.`
    room.sendAnnouncement(message, player.id, colors.gold);
    specs.push(player.id);
    var detectStart = teamSize
    updateTeamSize();
    if (detectStart == 0 && teamSize != 0) {
        twoCapVictory();
    }
    if (teamSize == 0) {
        message = `[BOT] There's not enough players to play.  Waiting for more players (minimum 4 to start)`
        room.sendAnnouncement(message, null, colors.red);
    }
}

room.onPlayerLeave = (player) => {

    removePlayerFromArrays(player.id);
    updateTeamSize();

    if (player.team > 0 && (room.getScores)) {
        room.pauseGame(true);
        setTimeout(function () { nextPickHandler(); }, 100);
    }

    if (teamSize == 0) {
        var players = room.getPlayerList();
        for (i = 0; i < players.length; i++) {
            room.setPlayerTeam(players[i].id, 0);
        }
        var message = `[BOT] There's not enough players to play.  Waiting for more players (minimum 4 to start)`
        room.sendAnnouncement(message, null, colors.red)
        result = 3;
        room.stopGame();
        clearTimer();
        return false;
    }
    
    if (red.length == 0 && blue.length == 0) {
        var blueCap = specs[0];
        var redCap = specs[1];
        room.setPlayerTeam(blueCap, 2);
        room.setPlayerTeam(redCap, 1);
        setTimeout(function () { nextPickHandler(); }, 100);
    } else if (red.length == 0) {
        room.setPlayerTeam(specs[0], 1);
        setTimeout(function () { nextPickHandler(); }, 100);
    } else if (blue.length == 0) {
        room.setPlayerTeam(specs[0], 2);
        setTimeout(function () { nextPickHandler(); }, 100);
    }
}


function updateTeamSize() {
    var players = room.getPlayerList();
    if (players.length > 8) {
        teamSize = 4;
    } else if (players.length > 6) {
        teamSize = 3
    } else if (players.length > 4) {
        teamSize = 2;
    } else {
        teamSize = 0;

    }
}

//when player is moved, move them from the arrays
room.onPlayerTeamChange = (player) => {
    switch (player.team) {
        case 0:
            movePlayerToSpecs(player.id);
            break;
        case 1:
            movePlayerToRed(player.id);
            break;
        case 2:
            movePlayerToBlue(player.id);
            break;
        default:
            break;
    }
}

function listSpecs(player) {
    var captain = room.getPlayer(player);
    var message = `[BOT] Please pick from the following list of player by @ing them or typing !pick # (example: !pick 1)`
    var message2 = ''
    for (i = 0; i < specs.length; i++) {
        var player = room.getPlayer(specs[i]);
        message2 += `[${i+1}]${player.name}, `
    }
    room.sendAnnouncement(message, captain.id, colors.gold, "bold", 2);
    room.sendAnnouncement(message2, captain.id, colors.gold);
}



room.onCommand_reboot = (player) => {
    if (rebootTimer == 0) {
        rebootList.push(player.name);
        setRebootTimer(player.name);
    } else {
        if (rebootList.includes(player.name)) {
            var message = `[BOT] ${player.name}, you've already voted to reboot the system.`
            room.sendAnnouncement(message, player.id, colors.red);
        } else {
            rebootList.push(player.name);
            var message = `[BOT] ${player.name} has voted to reboot the system.`
            room.sendAnnouncement(message, null, colors.red);
        }
        if (rebootList.length >= quorum) {
            rebootRoom();
        }
    }
}


function setRebootTimer(playerName) {
    var players = room.getPlayerList();
    quorum = Math.floor((players.length - 1) * 0.667);
    var message = `[BOT] ${playerName} has voted to reboot the system.  ${quorum} votes in the next 30 seconds are required to pass.  Type !reboot to vote to reboot.`
    room.sendAnnouncement(message, null, colors.red, "bold", 2);
    rebootTimer = 1;
    rebootInterval = setInterval(resetRebootTimer, 30000);
}

function resetRebootTimer() {
    //if reboottimer expires, then clear rebootList and unset the timer
    var message = `[BOT] Reboot vote failed.`
    room.sendAnnouncement(message, null, colors.red, "bold", 2);
    rebootList.splice(0, rebootList.length);
    clearInterval(rebootInterval);
    rebootTimer = 0;
}

function rebootRoom() {
    //reboot the room incase things break
    var message = `The room has voted to reboot the choose system.`
    room.sendAnnouncement(message, null, colors.red, "bold"); 

    // picking = 0 -> clear timers -> start game -> set result to 0 -> stop game -> twocap 
    quorum = 99;
    clearInterval(rebootInterval);
    rebootTimer = 0;
    rebootList.splice(0,rebootList.length)
    picking = 0;
    clearTimer();
    result = -1;
    room.stopGame();    

    if (teamSize > 0) {
        twoCapVictory();
    } else {
        var message = "[BOT] There's not enough players to play.  Waiting for more players (minimum 4 to start)";
        room.sendAnnouncement(message, null, colors.red);
    }
}



function getMap() {
    switch (teamSize) {
        case 2:
            room.setDefaultStadium("Classic");
            break;
        case 3:
            room.setDefaultStadium("Big");
            break;
        case 4:
            if (ballSize == 80) {
                room.setCustomStadium(eighty)
            } else if (ballSize == 85) {
                room.setCustomStadium(eightyfive)
            } else if (ballSize == 90) {
                room.setCustomStadium(ninety)
            } else {
                room.setDefaultStadium("Big Easy");
            }
            break;
    }
}

function movePlayerToRed(player) {
    if (player == 0) {
        room.reorderPlayers([0], true);
        return false;
    }
    removePlayerFromArrays(player);
    red.push(player);
}

function movePlayerToBlue(player) {
    if (player == 0) {
        room.reorderPlayers([0], true);
        return false;
    }
    removePlayerFromArrays(player);
    blue.push(player);
}

function movePlayerToSpecs(player) {
    if (player == 0) {
        room.reorderPlayers([0], true);
        return false;
    }
    removePlayerFromArrays(player);
    specs.push(player);
}

function removePlayerFromArrays(player) {
    if (red.indexOf(player) > -1) {
        red.splice(red.indexOf(player), 1);
    }
    if (blue.indexOf(player) > -1) {
        blue.splice(blue.indexOf(player), 1);
    }
    if (specs.indexOf(player) > -1) {
        specs.splice(specs.indexOf(player), 1);
    }
}