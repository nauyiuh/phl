/**
  *
  * Testing Plugin
  *
  */
  
  let room = HBInit();
  room.pluginSpec = {
		name: `phl/test`,
		author: `hk`,
		version: `0.0.1`
  };
  
 room.onGameStart = () => {
	var players = room.getPlayerList();
	players.forEach (element => sendAnnouncement(element.name);
  };