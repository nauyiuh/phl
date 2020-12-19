let room = HBInit();
room.pluginSpec = {
	name: 'hk/admin-text-color',
	author: `hk`,
	version: `1.0.0`,
	config: {
	},
	dependencies: [
		'sav/commands'
	]
};

var colors = {
	red: "0xff0000",
	gold: "0xffdc72",
	blue: "0X87CEFA"
};

//checks chat for @mentions from captain.
room.onPlayerChat = (player, arg) => {
	if (player.admin) {
		var message = `${player.name}: ${arg}`
		room.sendAnnouncement(message, null, colors.red)
		return false
	}
}