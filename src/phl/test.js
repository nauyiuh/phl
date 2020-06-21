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
		config: {},
		dependencies: [`sav/roles`]
  };
  
let blueTeamStreak = 0;
let redTeamStreak = 0;

function onTeamVictory(scores) {
  if (scores.red > scores.blue) {
    blueTeamStreak = 0;
    redTeamStreak++;
    room.sendAnnouncement(`Red team has won ${redTeamStreak} games in a row!`, null, 0xE56E56);
  } else {
    redTeamStreak = 0;
    blueTeamStreak++;
    room.sendAnnouncement(`Blue team has won ${blueTeamStreak} games in a row!`, null, 0x5689E5);
  }
}

room.onRoomLink = function onRoomLink() {
  room.onTeamVictory = onTeamVictory;
}