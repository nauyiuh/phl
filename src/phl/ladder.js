//Plugin sends win/lose data to a discord webhook
//URL parameter should be your discord webhook URL
//location parameter is if you want to discern between different rooms
//you can set your own map and half parameters, the default is Big Easy 7 Minute Halves
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



var gameData = {};
var colors = {
	red: "0xff0000",
	gold: "0xffdc72",
	blue: "0X87CEFA"
};
var match = {
	status: false,
	confirmRed: false,
	confirmBlue: false,
	half: 0,
	overtimeRed: null,
	forfeit: false,
};

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

room.onCommand0_help = (player, args) => {
	var message1 = `type !gs TeamOneCode TeamTwoCode to initiate a match between two teams`
	var message2 = `type !confirm to confirm the match once teams have been set`
	var message3 = `type !ready to continue a game once half is over and teams are set`
	var message4 = `type !forfeit during the game to forfeit the match`
	var message5 = `type !cancel to cancel a match in progress if the room breaks or incorrect code entry`

	room.sendAnnouncement(message1, player.id, colors.gold)
	room.sendAnnouncement(message2, player.id, colors.gold)
	room.sendAnnouncement(message3, player.id, colors.gold)
	room.sendAnnouncement(message4, player.id, colors.gold)
	room.sendAnnouncement(message5, player.id, colors.gold)

	return false;
}

room.onPlayerJoin = (player) => {
	var message = `Welcome ${player.name}!  Type !help for a brief summary of ladder commands`
	room.sendAnnouncement(message, player.id, colors.gold, "bold");
}

room.onTeamGoal = (team) => {

	if (match.status == true) {
		if ((match.half == team) || (team == match.overtimeRed)) {
			var message = `🚨${gameData.TeamOne} scores!🚨`;
			room.sendAnnouncement(message, null, colors.gold)
			gameData.TeamOneScore += 1;
		} else {
			var message = `🚨${gameData.TeamTwo} scores!🚨`;
			room.sendAnnouncement(message, null, colors.gold)
			gameData.TeamTwoScore += 1;
		}
	}
	var message = `${gameData.TeamOne} ${gameData.TeamOneScore} - ${gameData.TeamTwoScore} ${gameData.TeamTwo}`
	room.sendAnnouncement(message, null, colors.gold);
}


room.onGameStop = (player) => {
	//if a game is manually stopped, game is counted as cancelled
	if (match.status == true && player.id !== 0) {
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
	if (match.status == true && match.half == 1) {
		endFirstHalf();
	}
	if (match.status == true && match.half == 2) {
		if (gameData.TeamOneScore > gameData.TeamTwoScore) {
			teamOneVictory();
		} else if (gameData.TeamOneScore < gameData.TeamTwoScore) {
			teamTwoVictory();
		} else {
			endSecondHalf();
		}
	}
	if (match.status == true && match.half == 3) {
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
	gameData.formtype = "completed-match";
	sendMatchData("Match Reporter", gameData);
	clearMatch();
}

function teamTwoVictory() {
	var message = `✨${gameData.TeamTwo} victory!✨  Final score: ${gameData.TeamOne} ${gameData.TeamOneScore} - ${gameData.TeamTwoScore} ${gameData.TeamTwo}`
	room.sendAnnouncement(message, null, colors.gold);
	gameData.matchResult = 0;
	gameData.formtype = "completed-match";
	sendMatchData("Match Reporter", gameData);
	clearMatch();
}

function gameCancelled() {
	var message = `For manual report, please contact staff with replay and reference the room name & approximate time of game.`
	room.sendAnnouncement(message, null, colors.gold);
	gameData.matchResult = 999;
	gameData.formtype = "cancelled-match";
	sendMatchData("Match Cancelled", gameData);
	clearMatch();
}

room.onCommand_gs = (player, args) => {
	if (match.status !== false) {
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

	var message = `${player.name} has initiated a match between ${teamOne} and ${teamTwo}.  ${teamOne} starts on red side.`
	var message2 = `Both teams must !confirm to start. If team codes are incorrect, !cancel the match and initiate a new match`
	room.sendAnnouncement(message, null, colors.gold, "bold");
	room.sendAnnouncement(message2, null, colors.gold, "bold");

	match.status = 'pending';
	match.confirmRed = false;
	match.confirmBlue = false;
	match.half = 0;

	gameData.matchResult = 0;
	gameData.TeamOne = teamOne;
	gameData.TeamTwo = teamTwo;
	gameData.TeamOneScore = 0;
	gameData.TeamTwoScore = 0;

	return false
}

room.onCommand0_cancel = (player) => {
	//refer user to cancel confirm
	if (match.status) {
		var message = `WARNING: cancelling a match does not send a match record to database and should only be used if the room is stuck or for incorrect code entries.`
		var message2 = `To cancel match, type !cancel confirm`
		room.sendAnnouncement(message, player.id, colors.red);
		room.sendAnnouncement(message2, player.id, colors.red);
	}
		return false;

}

room.onCommand_cancel_confirm = (player) => {
	//if game hasn't started, cancel match without sending data
	//if game has started, cancel match with data
	if (match.status == 'pending' && half == 0) {
		var message = `Match has been cancelled by ${player.name}.`
		room.sendAnnouncement(message, null, colors.gold, "bold");
		clearMatch();
		return false;
	} else if (match.status) {
		var message = `Match has been cancelled by ${player.name}. No match record will be sent to database.`
		room.sendAnnouncement(message, null, colors.gold, "bold");
		room.stopGame();
		gameCancelled();
		return false;
    }
}

//confirm command without secret code
room.onCommand0_confirm = (player) => {

	room.sendAnnouncement(`${match.status}, ${player.team}`)

	if (match.status == 'pending' && player.team > 0) {
		var message = `Please confirm using your teams secret code. !confirm SecretCode`
		room.sendAnnouncement(message, player.id, colors.red)
		return false;
	} else if (match.status == 'pending' && player.team == 0) {
		var message = `Can only confirm from red or blue`
		room.sendAnnouncement(message, player.id, colors.red)
		return false;
	} else {
		var message = `No match pending confirmation.`
		room.sendAnnouncement(message, player.id, colors.red)
		return false;
	}
}

//confirm command with argument
room.onCommand1_confirm = (player, args) => {
	if (match.status == 'pending' && player.team == 0) {
		var message = `Can only confirm from red or blue`
		room.sendAnnouncement(message, player.id, colors.red)
		return false;
	} else if (player.team == 1 && match.confirmRed == false && half == 0 && match.status == 'pending') {
		match.confirmRed = true
		gameData.TeamOneSecret = args[0]
		var message = `${player.name} has confirmed for red side`
		var message2 = `You entered ${args[0]} as your secret code.  If this is incorrect, !cancel the match and try again.`
		room.sendAnnouncement(message, null, colors.red, "bold");
		room.sendAnnouncement(message2, player.id, colors.gold)
	} else if (player.team == 2 && match.confirmBlue == false && half == 0 && match.status == 'pending') {
		match.confirmBlue = true
		gameData.TeamTwoSecret = args[0]
		var message = `${player.name} has confirmed for blue side`
		var message2 = `You entered ${args[0]} as your secret code.  If this is incorrect, !cancel the match and try again.`
		room.sendAnnouncement(message, null, colors.blue, "bold");
		room.sendAnnouncement(message2, player.id, colors.gold)
	} else {
		var message = "No match pending confirmation"
		room.sendAnnouncement(message, player.id, colors.red)
		return false;
	}
	if (match.confirmRed == true && match.confirmBlue == true) {
		match.status = true;
		matchHandler();
	}
	return false;
}

//READY, it's confirm but in between halves
room.onCommand0_ready = (player) => {
	if (player.team == 1 && match.confirmRed == false && match.status == 'pending') {
		match.confirmRed = true
		var message = `${player.name} has readied for red side`
		room.sendAnnouncement(message, null, colors.red, "bold")
	} else if (player.team == 2 && match.confirmBlue == false && match.status == 'pending') {
		match.confirmBlue = true
		var message = `${player.name} has readied for blue side`
		room.sendAnnouncement(message, null, colors.blue, "bold")
	} else if (player.team == 0 && match.status == 'pending') {
		var message = `Can only ready from red or blue`
		room.sendAnnouncement(message, player.id, colors.red)
	} else {
		var message = `Can only ready when match is pending ready`
		room.sendAnnouncement(message, player.id, colors.red)
	}

	if (match.confirmRed == true && match.confirmBlue == true) {
		match.status = true;
		matchHandler();
	}
	return false
}

function clearTeams() {
	players = room.getPlayerList();
	for (i = 0; i < players.length; i++) {
		room.setPlayerTeam(players[i].id, 0);
	}
}



function matchHandler() {
	switch (match.half) {
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

//TODO set variables for different half time limits and maps in plugin configuration
function startFirstHalf() {
	match.half = 1;
	room.setScoreLimit(0);
	room.setTimeLimit(7);
	room.setDefaultStadium("Big Easy");
	var message = `First Half Started!`
	room.sendAnnouncement(message, null, colors.gold);
	room.startGame();
}

function startSecondHalf() {
	match.half = 2;
	room.setScoreLimit(0);
	room.setTimeLimit(7);
	room.setDefaultStadium("Big Easy");
	var message = `Second Half Started!`
	room.sendAnnouncement(message, null, colors.gold);
	room.startGame();
}
function startOvertime() {
	match.half = 3;
	room.setScoreLimit(1);
	room.setTimeLimit(0);
	room.setDefaultStadium("Big Easy");
	var message = `Overtime Started!`
	room.sendAnnouncement(message, null, colors.gold);
	room.startGame();
}

function endFirstHalf() {
	clearTeams();
	match.confirmRed = false;
	match.confirmBlue = false;
	match.status = "pending"
	var message = `First Half is over!  Score is ${gameData.TeamOne} ${gameData.TeamOneScore} - ${gameData.TeamTwoScore} ${gameData.TeamTwo}`
	var message2 = `${gameData.TeamTwo} starts Second Half on Red.  Type !ready to begin second half`
	room.sendAnnouncement(message, null, colors.gold);
	room.sendAnnouncement(message2, null, colors.gold, "bold");
}


function endSecondHalf() {
	var message = `Second Half is over!  Score is tied ${gameData.TeamOne} ${gameData.TeamOneScore} - ${gameData.TeamTwoScore} ${gameData.TeamTwo}`
	room.sendAnnouncement(message, null, colors.gold);
	//flip a coin to decide who is red
	if (Math.random() < 0.50) {
		overtimeRed = 2;
		message = `${gameData.TeamTwo} starts OT on Red.`
	} else {
		overtimeRed = 1;
		message = `${gameData.TeamOne} starts OT on Red.`
	}
	clearTeams();
	room.sendAnnouncement(message, null, colors.gold);
	message = `Type !ready to begin overtime`
	room.sendAnnouncement(message, null, colors.gold, "bold");
	match.confirmRed = false;
	match.confirmBlue = false;
	match.status = "pending";
}

function clearMatch() {
	match.status = false;
	match.confirmRed = false;
	match.confirmBlue = false;
	match.half = 0;
	match.overtimeRed = null;
	match.forfeit = false;
	for (var x in gameData) if (gameData.hasOwnProperty(x)) delete gameData[x];
}

room.onCommand_forfeit = (player) => {
	if (match.status !== true) {
		var message = `Can only forfeit a match while game is in progress.  If halftime, start the next half and then try again.`
		room.sendAnnouncement(message, null, colors.red);
		return false;
	} else if (player.team == 0) {
		var message = `Can only forfeit from red or blue side`
		room.sendAnnouncement(message, players.id, colors.red)
		return false;
    }

	if (match.half == player.team || (player.team == overtimeRed)) {
		message = `${gameData.TeamOne} ${player.name} has forfeited the game.`
		gameData.matchResult = 0;
	} else {
		message = `${gameData.TeamTwo} ${player.name} has forfeited the game.`
		gameData.matchResult = 1;
	}
	room.sendAnnouncement(message, null, colors.gold, "bold");

	match.forfeit = true;
	gameData.forfeit = player.name;
	gameData.half = match.half;
	var scores = room.getScores();
	gameData.time = scores.time;
	room.stopGame();
	gameData.formtype = "forfeit-match";
	sendMatchData("Match Reporter", gameData);
	clearMatch();

}

room.onGameTick = () => {
	let scores = room.getScores();
	if (match.status == true && scores.time >= scores.timeLimit && match.half != 3) {
		room.stopGame();
		halfHandler();
	}
}