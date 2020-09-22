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

var specs = [];
var red = [];
var blue = [];
var rebootList = [];
var result = 0;
var teamSize = 0;
var expiredTimer = 0;
var setTimer;  
var picking;
var rebootTimer = 0;
var quorum;
var rebootInterval;
var enabled = true;

room.setTeamsLock(true);

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

//toggles autoadmin
room.onCommand_autoadmin = (player, args) => {
    if (args[0] != room.getConfig().adminpass) {
        return false;
    }
    if (enabled) {
        enabled = false;
        room.sendAnnouncement(`[BOT] turning autoadmin off..`, player.id);
    } else {
        enabled = true;
        rebootRoom();
    }
    return false;
}

room.onGameStop = () => {
    if (enabled) {
        if (result == 0) {
            var message = "[BOT] Game was stopped by Admin.  Auto team pick disabled for this round, select teams manually.  If the room is broken type !reboot."
            room.sendAnnouncement(message, null, colors.red, "bold")
            return false;
        }

        if (result == -1) {
            var message = `[BOT] Room rebooting.  Setting new captains`
            room.sendAnnouncement(message, null, colors.red)
            return false;
        }

        switch (teamSize) {
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
    var redCap = specs[0];
    var blueCap = specs[1];
    room.setPlayerTeam(redCap, 1);
    room.setPlayerTeam(blueCap, 2);
    picking = blueCap;
    setTimeout(function () { setPick(blueCap); }, 100);
}

function timer(playerId) {
    setTimer = setInterval(capTimer, room.getConfig().configTimer, playerId)
}

function clearTimer() {
    clearInterval(setTimer);
    expiredTimer = 0;
}

function capTimer(playerId) {
    captain = room.getPlayer(playerId);
    expiredTimer++;
    room.sendAnnouncement(`[BOT] ${captain.name} is captain.  Waiting for their pick...`, null, colors.gold);
    room.sendAnnouncement(`Warning ${expiredTimer}.  If you don't pick a player by the 3rd warning, you will get kicked.`, playerId, colors.red, "bold")

    switch (expiredTimer){
        case 1:
        case 2:
            listSpecs(playerId);
            break;
        case 3:
            room.kickPlayer(playerId, "time expired", false);
            break;
        default:
            break;
    }
}

///
/// PICKING FUNCTIONS
///

//checks chat for @mentions from captain.
room.onPlayerChat = (player, arg) => {
    if (enabled) {
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
                message = `[BOT]Couldn't find ${pickPlayer} on specs. Name has to match exactly, so try to use the autocomplete.`
                room.sendAnnouncement(message, player.id, colors.red);
                listSpecs(player.id);
            }
        }
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
    var message = `Welcome, ${player.name}.  This room is automatically moderated.  In the event that the automatic captain and picking features fail, type !reboot to initiate a vote to reboot the room.`
    room.sendAnnouncement(message, player.id, colors.gold);
    specs.push(player.id);

    if (enabled) {
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
}

room.onPlayerLeave = (player) => {

    removePlayerFromArrays(player.id);

    if (enabled) {
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

    //if theres no admin in the room, enable automod
    var checkAdmins = room.getPlayerList();
    const result = checkAdmins.filter(v => v.admin == true);
    if (result === undefined || result.length == 1) {
        enabled = true;
    }

}


function updateTeamSize() {
    var players = room.getPlayerList();
    if (players.length > 10) {
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
    var message = `[BOT] Pick a player by @ing them (example @PlayerName).`  
    room.sendAnnouncement(message, captain.id, colors.gold, "bold", 2);
    room.sendAnnouncement(message, captain.id, colors.gold, "bold", 2);
    room.sendAnnouncement(message, captain.id, colors.gold, "bold", 2);
}



room.onCommand0_reboot = (player) => {
    if (enabled) {
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
}

room.onCommand1_reboot = (player, arg) => {
    if (arg[0] == room.getConfig().adminpass) {
        rebootRoom();
        return false;
    }
    return false;
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
    var message = `[BOT] Rebooting automod...`
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
    updateTeamSize();
    enabled = true;

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
            room.setScoreLimit(3);
            room.setTimeLimit(3);
            break;
        case 3:
            room.setDefaultStadium("Big");
            room.setScoreLimit(3);
            room.setTimeLimit(3);
            break;
        case 4:
            room.setDefaultStadium("Big Easy");
            room.setScoreLimit(3);
            room.setTimeLimit(4);
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