//plugin sets the ball size so I don't need to load a hundred maps

let room = HBInit();
room.pluginSpec = {
	name: 'hk/ballsize',
	author: `hk`,
	version: `1.0.0`,
	config: {
		adminpass: ""
	},
	dependencies: [
		'sav/commands'
	]
};

//default ballsize
var ballsize = 10;

room.onCommand_ballsize = (player, arg) => {
	if (arg[0] != room.getConfig().adminpass) {
		return false;
    }

	ballsize = parseFloat(arg[1]);
	room.sendAnnouncement(`trying to set ball size to ${arg[1]}`)
	if (!ballsize) {
		ballsize = 10;
		room.sendAnnouncement(`couldnt set ball size to ${arg[1]}, set to default instead`);
    }
}

room.onGameStart = () => {
	room.setDiscProperties(0, { "radius": ballsize });
}

room.onPositionsReset = () => {
	room.setDiscProperties(0, { "radius": ballsize });
}
