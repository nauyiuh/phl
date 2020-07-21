var room = HBInit();

room.pluginSpec = {
	name: 'hk/ladder',
	author: `hk`,
	version: `1.0.0`,
	config: {
		url: "",
		location: ""
    },
	dependencies: [
		'sav/commands'
	]
};

var matchStatus = false;
var confirmBlue = false;
var confirmRed = false;
var gameData = {};
var half = 0;
var overtimeRed;
var forfeit = false;
var colors = { red: "0xff0000", gold: "0xffdc72", blue: "0X87CEFA"};

function sendMatchData(userName, content) {
	var location = room.getConfig().location;
	content.location = location;
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

room.onCommand_help = (player, args) => {
	var message1 = `type !gs TeamOneCode TeamTwoCode to initiate a match between two teams`
	var message2 = `type !confirm to confirm the match once teams have been set`
	var message3 = `type !forfeit during the game to forfeit the match`

	room.sendAnnouncement(message1, player.id, colors.gold)
	room.sendAnnouncement(message2, player.id, colors.gold)
	room.sendAnnouncement(message3, player.id, colors.gold)
	return false;
}

room.onPlayerJoin = (player) => {
	var message = `Welcome ${player.name}!  Type !help for a brief summary of ladder commands`
	room.sendAnnouncement(message, player.id, colors.gold, "bold");
}

room.onTeamGoal = (team) => {
	if (matchStatus == true) {
		if (half == 1) {
			if (team == 1) {
				var message = `🚨${gameData.TeamOne} scores!🚨`;
				room.sendAnnouncement(message, null, colors.gold)
				gameData.TeamOneScore += 1;
			}
			if (team == 2) {
				var message = `🚨${gameData.TeamTwo} scores!🚨`;
				room.sendAnnouncement(message, null, colors.gold)
				gameData.TeamTwoScore += 1;
			}
		}
		if (half == 2) {
			if (team == 1) {
				var message = `🚨${gameData.TeamTwo} scores!🚨`;
				room.sendAnnouncement(message, null, colors.gold)
				gameData.TeamTwoScore += 1;
			}
			if (team == 2) {
				var message = `🚨${gameData.TeamOne} scores!🚨`;
				room.sendAnnouncement(message, null, colors.gold)
				gameData.TeamOneScore += 1;
			}
		}
		if (half == 3) {
			if (team == overtimeRed) {
				var message = `🚨${gameData.TeamOne} scores!🚨`;
				room.sendAnnouncement(message, null, colors.gold)
				gameData.TeamOneScore += 1;
			}
			if (team !== overtimeRed) {
				var message = `🚨${gameData.TeamTwo} scores!🚨`;
				room.sendAnnouncement(message, null, colors.gold)
				gameData.TeamTwoScore += 1;
			}
		}
		var message = `${gameData.TeamOne} ${gameData.TeamOneScore} - ${gameData.TeamTwoScore} ${gameData.TeamTwo}`
		room.sendAnnouncement(message, null, colors.gold);
	}
}

room.onGameStop = (player) => {
	//if a game is manually stopped, game is counted as cancelled
	if (matchStatus == true && player.id !== 0) {
		gameData.cancel = player.name
		gameCancelled();
		return false;
    }
}

room.onTeamVictory = () => {
	room.stopGame();
	halfHandler();
}


function halfHandler() {
	if (matchStatus == true && half == 1) {
		endFirstHalf();
	}
	if (matchStatus == true && half == 2) {
		if (gameData.TeamOneScore > gameData.TeamTwoScore) {
			teamOneVictory();
		} else if (gameData.TeamOneScore < gameData.TeamTwoScore) {
			teamTwoVictory();
		} else {
			endSecondHalf();
		}
	}
	if (matchStatus == true && half == 3) {
		if (gameData.TeamOneScore > gameData.TeamTwoScore) {
			teamOneVictory();
		} else if (gameData.TeamOneScore < gameData.TeamTwoScore) {
			teamTwoVictory();
		}
	}
}


function teamOneVictory() {
	var message = `✨${gameData.TeamOne} victory!✨  Final score ${gameData.TeamOne} ${gameData.TeamOneScore} - ${gameData.TeamTwoScore} ${gameData.TeamTwo}`;
	room.sendAnnouncement(message, null, colors.gold);
	gameData.matchResult = 1;
	sendMatchData("Match Reporter", gameData);
	clearMatch();
}

function teamTwoVictory() {
	var message = `✨${gameData.TeamTwo} victory!✨  Final score: ${gameData.TeamOne} ${gameData.TeamOneScore} - ${gameData.TeamTwoScore} ${gameData.TeamTwo}`
	room.sendAnnouncement(message, null, colors.gold);
	gameData.matchResult = 0;
	sendMatchData("Match Reporter", gameData);
	clearMatch();
}

function gameCancelled() {
	var message = `Match between ${gameData.TeamOne} and ${gameData.TeamTwo} cancelled by ${gameData.cancel}.  For manual report, please submit replay and refer to room name and approximate report time`
	room.sendAnnouncement(message, null, colors.gold);
	gameData.matchResult = 999;
	sendMatchData("Match Cancelled", gameData);
	clearMatch();
}




room.onCommand_gs = (player, args) => {

	if (matchStatus !== false) {
		var message = `There is a game pending confirmation or in progress`;
		room.sendAnnouncement(message, player.id, colors.red);
		return false;
	}
	if (!Array.isArray(args) || args.length !== 2) {
		var message = `Usage: !gs RedTeam BlueTeam`;
		room.sendAnnouncement(message, player.id, colors.red);
		return false;
	}

	var teamOne = args[0];
	var teamTwo = args[1];

	var message = `${player.name} has initiated a match between ${teamOne} and ${teamTwo}.  ${teamOne} starts on red side.  Both teams !confirm to start`
	room.sendAnnouncement(message, null, colors.gold, "bold");

	matchStatus = "pending";
	confirmRed = false;
	confirmBlue = false;

	gameData.matchResult = 0;
	gameData.TeamOne = teamOne;
	gameData.TeamTwo = teamTwo;
	gameData.TeamOneScore = 0;
	gameData.TeamTwoScore = 0;

	return false
}

room.onCommand_confirm = (player) => {
	if (matchStatus == "pending") {
		if (player.team == 0) {
			var message = `Can only confirm from red or blue`
			room.sendAnnouncement(message, player.id, 0xff0000);
		}
		if (player.team == 1 && confirmRed == false) {
			var message = `${player.name} has confirmed for red side`
			room.sendAnnouncement(message, null, colors.red, "bold");
			confirmRed = true;
		}
		if (player.team == 2 && confirmBlue == false) {
			var message = `${player.name} has confirmed for blue side`
			room.sendAnnouncement(message, null, colors.blue, "bold");
			confirmBlue = true;
		}
	}
	if (matchStatus !== "pending") {
		var message = `No match pending confirmation.`;
		room.sendAnnouncement(message, player.id, colors.red);
		return false;
	}
	if (confirmRed == true && confirmBlue == true) {
		matchStatus = true;
		matchHandler();
	}
	return false
}

function swapTeams() {
	players = room.getPlayerList();
	for (i = 0; i < players.length; i++) {
		room.setPlayerTeam(players[i].id, 0);
	}
}



function matchHandler() {
	switch (half) {
		case 0:
			startFirstHalf();
			break;
		case 1:
			startSecondHalf();
			break;
		case 2:
			startOvertime();
			break;
	}
}

function startFirstHalf() {
	half = 1;
	room.setScoreLimit(0);
	room.setTimeLimit(1);
	room.setDefaultStadium("Classic");
	var message = `First Half Started!`
	room.sendAnnouncement(message, null, colors.gold);
	room.startGame();
}

function startSecondHalf() {
	half = 2;
	room.setScoreLimit(0);
	room.setTimeLimit(1);
	room.setDefaultStadium("Classic");
	var message = `Second Half Started!`
	room.sendAnnouncement(message, null, colors.gold);
	room.startGame();
}
function startOvertime() {
	half = 3;
	room.setScoreLimit(1);
	room.setTimeLimit(0);
	room.setDefaultStadium("Classic");
	var message = `Overtime Started!`
	room.sendAnnouncement(message, null, colors.gold);
	room.startGame();
}

function endFirstHalf() {
	swapTeams();
	confirmRed = false;
	confirmBlue = false;
	matchStatus = "pending"
	var message = `First Half is over!  Score is ${gameData.TeamOne} ${gameData.TeamOneScore} - ${gameData.TeamTwoScore} ${gameData.TeamTwo}`
	var message2 = `Type !confirm to begin second half`
	room.sendAnnouncement(message, null, colors.gold);
	room.sendAnnouncement(message2, null, colors.gold, "bold");
}


function endSecondHalf() {
	var message = `Second Half is over!  Score is tied ${gameData.TeamOne} ${gameData.TeamOneScore} - ${gameData.TeamTwoScore} ${gameData.TeamTwo}` 
	room.sendAnnouncement(message, null, colors.gold);
	//flip a coin to decide who is red
	if (Math.random() < 0.50) {
		overtimeRed = 2;
		message = `${gameData.TeamTwo} starts overtime on Red.`;
	} else {
		overtimeRed = 1;
		message = `${gameData.TeamOne} starts overtime on Red.`
	}
	swapTeams();
	room.sendAnnouncement(message, null, colors.gold);
	message = `Type !confirm to begin overtime`
	room.sendAnnouncement(message, null, colors.gold, "bold");
	confirmRed = false;
	confirmBlue = false;
	matchStatus = "pending";
}

function clearMatch() {
	matchStatus = false;
	confirmBlue = false;
	confirmRed = false;
	for (var x in gameData) if (gameData.hasOwnProperty(x)) delete gameData[x];
	half = 0;
}

room.onCommand_forfeit = (player) => {
	if (matchStatus !== true) {
		var message = `Can only forfeit a match while game is in progress.  If halftime, start the next half and then try again.`
		room.sendAnnouncement(message, null, colors.id);
		return false;
    }

	if (half == 1 && player.team == 1) {
		message = `${gameData.TeamOne} ${player.name} has forfeited the game.`
		gameData.matchResult = 0;
	} else if (half == 2 && player.team == 2) {
		message = `${gameData.TeamOne} ${player.name} has forfeited the game.`
		gameData.matchResult = 0;
	} else if (half == 3 && player.team == 1 && overtimeRed == 1) {
		message = `${gameData.TeamOne} ${player.name} has forfeited the game.`
		gameData.matchResult = 0;
	} else {
		message = `${gameData.TeamTwo} ${player.name} has forfeited the game.`
		gameData.matchResult = 1;
	}

	room.sendAnnouncement(message, null, colors.gold);

	forfeit = true;
	gameData.forfeit = player.name;
	gameData.half = half;
	var scores = room.getScores();
	gameData.time = scores.time;
	room.stopGame();

	sendMatchData("Match Reporter", gameData);
	clearMatch();
	
}


room.onGameTick = () => {
	let scores = room.getScores();
	if (matchStatus == true && scores.time >= scores.timeLimit && half != 3) {
		room.stopGame();
		halfHandler();
    }
}