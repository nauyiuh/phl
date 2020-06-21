/**
  *
  * Testing Plugin
  *
  */
  
  let room = HBInit();
  room.pluginSpec = {
		name: `phl/test1`,
		author: `hk`,
		version: `0.0.1`
		config: {},
  };
  
// If there are no admins left in the room give admin to one of the remaining players.
function updateAdmins() { 
  // Get all players except the host (id = 0 is always the host)
  var players = room.getPlayerList().filter((player) => player.id != 0 );
  if ( players.length == 0 ) return; // No players left, do nothing.
  if ( players.find((player) => player.admin) != null ) return; // There's an admin left so do nothing.
  room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
}

function onPlayerJoin(player) {
  updateAdmins();
}

function onPlayerLeave(player) {
  updateAdmins();
}

room.onRoomLink = function onRoomLink() {
  room.onPlayerLeave = onPlayerLeave;
  room.onPlayerJoin = onPlayerJoin;
}