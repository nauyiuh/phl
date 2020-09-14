/**
 * This plugin enforces one nickname per auth and conn.
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
// Maps conn -> nick
const conns = {};

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
    const oldName = auths[player.auth] !== undefined ? auths[player.auth] :
        conns[player.conn] !== undefined ? conns[player.conn] : player.name;
    if (oldName !== player.name) {
        setTimeout(function () { room.kickPlayer(player.id, `Re-join as ${oldName}`); }, 500);
        return false;
    }

    
    var exists = Object.values(auths).includes(player.name)
    if (exists) {
        var checkAuth = Object.keys(auths).find(key => auths[key] === player.name);
        if (checkAuth != player.auth) {
            setTimeout(function () {
                room.kickPlayer(player.id, `There can only be one ${player.name}.  If you believe this message to be in error either (1)Use the same browser and profile you originally used to connect with, (2)Update your authorization, or (3)Contact an admin to free your name`);}, 500);
        }
    }
    

    auths[player.auth] = player.name;
    conns[player.conn] = player.name;
    var message = `[BOT] Registered as ${player.name}.  If you'd like to change your name you will have to contact an admin.`
    room.sendAnnouncement(message, player.id)
}

room.onCommand_clear = (player, args) => {
    //check if admin pass is correct
    if (args[0] != room.getConfig().adminpass) {
        return false;
    }

    playerName = args.slice(1).join(" ");
    var deleteAuth = Object.keys(auths).find(key => auths[key] === playerName);
    var deleteConn = Object.keys(conns).find(key => conns[key] === playerName);

    delete auths[deleteAuth];
    delete conns[deleteConn];

    var message1 = `[BOT] ${playerName} (case-sensitive) being deleted from object. If below returns undefined the player was not found. `
    var message2 = `[BOT] ${deleteAuth} removed from object`
    var message3 = `[BOT] ${deleteConn} removed from object`
    room.sendAnnouncement(message1, player.id)
    room.sendAnnouncement(message2, player.id)
    room.sendAnnouncement(message3, player.id)
    return false;
}


function onPersistHandler() {
    return { auths, conns };
}

function onRestoreHandler(data) {
    if (data === undefined) return;

    Object.assign(auths, data.auths || {});
    Object.assign(conns, data.conns || {});
}

//
// Exports
//

room.onPlayerJoin = onPlayerJoinHandler;
room.onPersist = onPersistHandler;
room.onRestore = onRestoreHandler;