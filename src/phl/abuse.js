/**
 * This plugin enforces one nickname per auth and conn.
 *
 * Once a user has joined with a nickname, joining with
 * another nickname later will be logged in discord
 * unless they change both their auth and IP.
 */

var room = HBInit();

room.pluginSpec = {
    name: `hk/abuse`,
    author: `saviola modified by hk`,
    version: `1.0.0`,
    config: {
        url: "",
        location: ""
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
var abuseData = {};

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

        abuseData.Name = player.name;
        abuseData.OldName = oldName;
        abuseData.Auth = player.auth;
        abuseData.Conn = player.conn;
        sendWebHook("abuse log", abuseData);
        return false;
    }

    auths[player.auth] = player.name;
    conns[player.conn] = player.name;
}

function onPersistHandler() {
    return { auths, conns };
}

function onRestoreHandler(data) {
    if (data === undefined) return;

    Object.assign(auths, data.auths || {});
    Object.assign(conns, data.conns || {});
}


function sendWebHook(username, content) {
    content.formtype = "abuse";
    var xhr = new XMLHttpRequest();
    var webhook_url = room.getConfig().url;
    xhr.open('POST', webhook_url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            room.sendChat(xhr.response);
            console.log(xhr.response);
        }
    };
    var data = JSON.stringify({
        "username": username,
        "content": JSON.stringify(content)
    });
    xhr.send(data);
}

//
// Exports
//

room.onPlayerJoin = onPlayerJoinHandler;
room.onPersist = onPersistHandler;
room.onRestore = onRestoreHandler;