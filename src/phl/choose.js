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

var hotHuge = `{"name":"Hot huge Perfect 0.1 Ver","width":840,"height":380,"bg":{"type":"grass","width":740,"height":340,"kickOffRadius":80},"vertexes":[{"x":-740,"y":340,"cMask":["ball"]},{"x":-740,"y":110,"cMask":["ball"]},{"x":-740,"y":-110,"cMask":["ball"]},{"x":-740,"y":-340,"cMask":["ball"]},{"x":740,"y":340,"cMask":["ball"]},{"x":740,"y":110,"cMask":["ball"]},{"x":740,"y":-110,"cMask":["ball"]},{"x":740,"y":-340,"cMask":["ball"]},{"x":0,"y":380,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-80,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-380,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":-740,"y":-340,"cMask":["wall"]},{"x":740,"y":-340,"cMask":["wall"]},{"x":-740,"y":340,"cMask":["wall"]},{"x":740,"y":340,"cMask":["wall"]},{"x":740,"y":110,"cMask":["wall"]},{"x":740,"y":340,"cMask":["wall"]},{"x":-740,"y":110,"cMask":["wall"]},{"x":-740,"y":340,"cMask":["wall"]},{"x":-740,"y":-340,"cMask":["wall"]},{"x":-740,"y":-110,"cMask":["wall"]},{"x":740,"y":-340,"cMask":["wall"]},{"x":740,"y":-110,"cMask":["wall"]},{"x":0,"y":-80,"cMask":["wall"]},{"x":0,"y":80,"cMask":["wall"]},{"x":0,"y":-80,"cMask":["wall"]},{"x":0,"y":80,"cMask":["wall"]},{"x":0,"y":-340,"cMask":["wall"]},{"x":0,"y":-80,"cMask":["wall"]},{"x":0,"y":80,"cMask":["wall"]},{"x":0,"y":340,"cMask":["wall"]},{"x":-740,"y":-110,"cMask":["ball"]},{"x":-785,"y":-90,"cMask":["ball"]},{"x":-740,"y":110,"cMask":["ball"]},{"x":-785,"y":90,"cMask":["ball"]},{"x":740,"y":-110,"cMask":["ball"]},{"x":785,"y":-90,"cMask":["ball"]},{"x":785,"y":90,"cMask":["ball"]},{"x":740,"y":110,"cMask":["ball"]},{"x":-741,"y":340,"cMask":["ball"]},{"x":-748,"y":340,"cMask":["ball"]},{"x":-748,"y":110,"cMask":["ball"]},{"x":-748,"y":-110,"cMask":["ball"]},{"x":-748,"y":-340,"cMask":["ball"]},{"x":-756,"y":340,"cMask":["ball"]},{"x":-756,"y":110,"cMask":["ball"]},{"x":-756,"y":-110,"cMask":["ball"]},{"x":-756,"y":-340,"cMask":["ball"]},{"x":-762,"y":340,"cMask":["ball"]},{"x":-762,"y":110,"cMask":["ball"]},{"x":-762,"y":-110,"cMask":["ball"]},{"x":-762,"y":-340,"cMask":["ball"]},{"x":-770,"y":340,"cMask":["ball"]},{"x":-770,"y":110,"cMask":["ball"]},{"x":-770,"y":-110,"cMask":["ball"]},{"x":-770,"y":-340,"cMask":["ball"]},{"x":748,"y":340,"cMask":["ball"]},{"x":748,"y":110,"cMask":["ball"]},{"x":748,"y":-110,"cMask":["ball"]},{"x":748,"y":-340,"cMask":["ball"]},{"x":756,"y":340,"cMask":["ball"]},{"x":756,"y":110,"cMask":["ball"]},{"x":756,"y":-110,"cMask":["ball"]},{"x":756,"y":-340,"cMask":["ball"]},{"x":762,"y":340,"cMask":["ball"]},{"x":762,"y":110,"cMask":["ball"]},{"x":762,"y":-110,"cMask":["ball"]},{"x":762,"y":-340,"cMask":["ball"]},{"x":770,"y":340,"cMask":["ball"]},{"x":770,"y":110,"cMask":["ball"]},{"x":770,"y":-110,"cMask":["ball"]},{"x":770,"y":-340,"cMask":["ball"]},{"x":-747,"y":340,"cMask":["ball"]},{"x":-747,"y":110,"cMask":["ball"]},{"x":-747,"y":-110,"cMask":["ball"]},{"x":-747,"y":-340,"cMask":["ball"]},{"x":-746,"y":340,"cMask":["ball"]},{"x":-746,"y":110,"cMask":["ball"]},{"x":-746,"y":-110,"cMask":["ball"]},{"x":-746,"y":-340,"cMask":["ball"]},{"x":747,"y":340,"cMask":["ball"]},{"x":747,"y":110,"cMask":["ball"]},{"x":747,"y":-110,"cMask":["ball"]},{"x":747,"y":-340,"cMask":["ball"]},{"x":746,"y":340,"cMask":["ball"]},{"x":746,"y":110,"cMask":["ball"]},{"x":746,"y":-110,"cMask":["ball"]},{"x":746,"y":-340,"cMask":["ball"]}],"segments":[{"v0":0,"v1":1,"vis":false,"cMask":["ball"]},{"v0":2,"v1":3,"vis":false,"cMask":["ball"]},{"v0":4,"v1":5,"vis":false,"cMask":["ball"]},{"v0":6,"v1":7,"vis":false,"cMask":["ball"]},{"v0":8,"v1":9,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":9,"v1":10,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["blueKO"]},{"v0":10,"v1":9,"bCoef":0.1,"curve":180,"curveF":6.123233995736766e-17,"vis":false,"cMask":["red","blue"],"cGroup":["redKO"]},{"v0":10,"v1":11,"bCoef":0.1,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":12,"v1":13,"cMask":["wall"],"color":"C7E6BD"},{"v0":14,"v1":15,"cMask":["wall"],"color":"C7E6BD"},{"v0":16,"v1":17,"cMask":["wall"],"color":"C7E6BD"},{"v0":18,"v1":19,"cMask":["wall"],"color":"C7E6BD"},{"v0":20,"v1":21,"cMask":["wall"],"color":"C7E6BD"},{"v0":22,"v1":23,"cMask":["wall"],"color":"C7E6BD"},{"v0":25,"v1":24,"curve":180,"curveF":6.123233995736766e-17,"cMask":["wall"],"color":"C7E6BD"},{"v0":26,"v1":27,"curve":180,"curveF":6.123233995736766e-17,"cMask":["wall"],"color":"C7E6BD"},{"v0":28,"v1":29,"cMask":["wall"],"color":"C7E6BD"},{"v0":30,"v1":31,"cMask":["wall"],"color":"C7E6BD"},{"v0":33,"v1":32,"curve":20,"curveF":5.671281819617709,"cMask":["ball"],"color":"C7E6BD"},{"v0":34,"v1":35,"curve":20,"curveF":5.671281819617709,"cMask":["ball"],"color":"C7E6BD"},{"v0":36,"v1":37,"curve":20,"curveF":5.671281819617709,"cMask":["ball"],"color":"C7E6BD"},{"v0":38,"v1":39,"curve":20,"curveF":5.671281819617709,"cMask":["ball"],"color":"C7E6BD"},{"v0":37,"v1":38,"curve":20,"curveF":5.671281819617709,"color":"C7E6BD"},{"v0":35,"v1":33,"curve":20,"curveF":5.671281819617709,"color":"C7E6BD"},{"v0":41,"v1":42,"vis":false,"cMask":["ball"]},{"v0":43,"v1":44,"vis":false,"cMask":["ball"]},{"v0":45,"v1":46,"vis":false,"cMask":["ball"]},{"v0":47,"v1":48,"vis":false,"cMask":["ball"]},{"v0":49,"v1":50,"vis":false,"cMask":["ball"]},{"v0":51,"v1":52,"vis":false,"cMask":["ball"]},{"v0":53,"v1":54,"vis":false,"cMask":["ball"]},{"v0":55,"v1":56,"vis":false,"cMask":["ball"]},{"v0":57,"v1":58,"vis":false,"cMask":["ball"]},{"v0":59,"v1":60,"vis":false,"cMask":["ball"]},{"v0":61,"v1":62,"vis":false,"cMask":["ball"]},{"v0":63,"v1":64,"vis":false,"cMask":["ball"]},{"v0":65,"v1":66,"vis":false,"cMask":["ball"]},{"v0":67,"v1":68,"vis":false,"cMask":["ball"]},{"v0":69,"v1":70,"vis":false,"cMask":["ball"]},{"v0":71,"v1":72,"vis":false,"cMask":["ball"]},{"v0":73,"v1":74,"vis":false,"cMask":["ball"]},{"v0":75,"v1":76,"vis":false,"cMask":["ball"]},{"v0":77,"v1":78,"vis":false,"cMask":["ball"]},{"v0":79,"v1":80,"vis":false,"cMask":["ball"]},{"v0":81,"v1":82,"vis":false,"cMask":["ball"]},{"v0":83,"v1":84,"vis":false,"cMask":["ball"]},{"v0":85,"v1":86,"vis":false,"cMask":["ball"]},{"v0":87,"v1":88,"vis":false,"cMask":["ball"]}],"planes":[{"normal":[0,1],"dist":-340,"cMask":["ball"]},{"normal":[0,-1],"dist":-340,"cMask":["ball"]},{"normal":[0,1],"dist":-380,"bCoef":0.1},{"normal":[0,-1],"dist":-380,"bCoef":0.1},{"normal":[1,0],"dist":-840,"bCoef":0.1},{"normal":[-1,0],"dist":-840,"bCoef":0.1}],"goals":[{"p0":[-740,110],"p1":[-740,-110],"team":"red"},{"p0":[740,-110],"p1":[740,110],"team":"blue"}],"discs":[{"radius":6.4,"color":"7CFC00","cGroup":["ball","kick","score"]},{"pos":[740,-110],"radius":5.5,"bCoef":1,"invMass":0},{"pos":[740,110],"radius":5.5,"bCoef":1,"invMass":0},{"pos":[-740,110],"radius":5.5,"bCoef":1,"invMass":0},{"pos":[-740,-110],"radius":5.5,"bCoef":1,"invMass":0}],"playerPhysics":{"invMass":0.3,"acceleration":0.105,"kickingAcceleration":0.073,"kickingDamping":0.97,"kickStrength":5.7},"ballPhysics":"disc0","spawnDistance":350}`

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
    const resultAdmin = checkAdmins.filter(v => v.admin == true);
    if (resultAdmin === undefined || resultAdmin.length == 1) {
        enabled = true;
    }

}

// settings for this -> updated to koreaball hot huge only
function updateTeamSize() {
    var players = room.getPlayerList();
    if (players.length > 8) {
        teamSize = 4;
    } else if (players.length > 6) {
        teamSize = 0;
    } else if (players.length > 4) {
        teamSize = 0;
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
            room.setCustomStadium(hotHuge);
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