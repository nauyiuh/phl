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
  
 room.onGameStart = function () {
	//var players = room.getPlayerList();
	room.sendChat('Game Start');
	//players.forEach (element => room.sendChat(element.name);
  }