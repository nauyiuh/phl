let room = HBInit();
room.pluginSpec = {
	name: 'hk/admin',
	author: `hk`,
	version: `1.0.0`,
	config: {
		pass: ""
	},
	dependencies: [
		'sav/commands'
	]
};


room.onCommand_clearbans = (player) => {
	if (player.admin == true) {
		room.clearBans();
		room.sendAnnouncement("Bans cleared", player.id);
	}
	return false
}

room.onCommand_auth = (player, args) => {
	if (args[0] == room.getConfig().pass) {
		room.setPlayerAdmin(player.id, true);
	}
	return false
}

room.onCommand_remove = (player, args) => {
	room.setPlayerAdmin(player.id, false);
}
