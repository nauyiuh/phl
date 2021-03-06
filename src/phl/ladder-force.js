/**
 * This plugin enforces one nickname per auth
 * 
 */

var room = HBInit();

room.pluginSpec = {
    name: `hk/ladder-force`,
    author: `saviola modified by hk`,
    version: `1.0.0`,
    config: {
        url: "",
        location: "",
        adminpass: "",
    },
    dependencies: [
        'sav/commands'
    ]
};

//
// Global variables
//

// Maps auth -> nick
const auths = {};

//
// Event handlers
//


/**
 * Kicks a player if someone with the same auth or conn has joined with a
 * different name before.
 *
 * Stores a mapping between player auth/conn and nick otherwise.
 */

function onPlayerJoinHandler(player) {
    const oldName = auths[player.auth] !== undefined ? auths[player.auth] : player.name;

    /*
     * commented out to allow player to alias.  kept other check so that names are protected by their auth for ladder integrity.
    if (oldName !== player.name) {
        setTimeout(function () { room.kickPlayer(player.id, `Re-join as ${oldName}`); }, 500);
        return false;
    }
    */
    var exists = Object.values(auths).includes(player.name)
    if (exists) {
        var checkAuth = Object.keys(auths).find(key => auths[key] === player.name);
        if (checkAuth != player.auth) {
            setTimeout(function () {
                room.kickPlayer(player.id, `There can only be one ${player.name}.  If you believe this message to be in error either (1)Use the same browser and profile you originally used to connect with, (2)Update your authorization, or (3)Contact an admin to free your name`);}, 500);
        }
    }
    
    auths[player.auth] = player.name;
}

room.onCommand_clear = (player, args) => {
    //check if admin pass is correct
    if (args[0] != room.getConfig().adminpass) {
        return false;
    }

    playerName = args.slice(1).join(" ");
    var deleteAuth = Object.keys(auths).find(key => auths[key] === playerName);

    delete auths[deleteAuth];

    var message1 = `[BOT] ${playerName} (case-sensitive) being deleted from object. If below returns undefined the player was not found. `
    var message2 = `[BOT] ${deleteAuth} removed from object`
    room.sendAnnouncement(message1, player.id)
    room.sendAnnouncement(message2, player.id)
    return false;
}


function onPersistHandler() {
    return { auths};
}

function onRestoreHandler(data) {
    if (data === undefined) return;

    Object.assign(auths, data.auths || {});
}

//
// Exports
//
room.onPlayerJoin = onPlayerJoinHandler;
room.onPersist = onPersistHandler;
room.onRestore = onRestoreHandler;