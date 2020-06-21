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
	//var players = room.getPlayerList();
	room.sendAnnouncement('Game Started');
	//players.forEach (element => room.sendChat(element.name);
  }
  
  room.onPlayerJoin = () => {
	  room.sendAnnouncement('player joined');
  }
  