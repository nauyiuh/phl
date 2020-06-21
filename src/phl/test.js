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
  
 room.onPlayerBallKick = () => {
	//var players = room.getPlayerList();
	room.sendChat('Testing text');
	//players.forEach (element => room.sendChat(element.name);
  };