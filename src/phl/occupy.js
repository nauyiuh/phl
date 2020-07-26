//when room is occupied, send a message to webhook channel every minute w/ a list of who is in the room
var room = HBInit();

room.pluginSpec = {
	name: 'hk/occupy',
	author: `hk`,
	version: `1.0.0`,
	config: {
		url: "",
		location: ""
	},
};

var intervalVal;

function occupancyUpdate() {
	var players = [];
	var player = room.getPlayerList();
	for (i = 0; i < player.length; i++) {
			players.push(player[i].name);
	}
	var location = room.getConfig().location;
	var occupy = true;
	var content = { occupy: occupy, players: players, location: location }
	sendMatchData("occupy", content);
}

function sendMatchData(userName, content) {
	content.formtype = 'occupy'
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

room.onPlayerJoin = () => {
	var player = room.getPlayerList();
	if (player.length == 2) {
		occupancyUpdate();
		intervalVal = setInterval(occupancyUpdate, 30000);
    }
}

room.onPlayerLeave = () => {
	if (room.getPlayerList().length == 1) {
		occupancyUpdate();
		clearInterval(intervalVal);
    }
}
