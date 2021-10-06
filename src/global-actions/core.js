const utils = require("utils");

const hostileParts = [ATTACK, RANGED_ATTACK, HEAL, CLAIM];
const hostileThreshold = 4;


module.exports.determineCreepNumbers = () => {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];

        if (isUnderAttack(room)) {
            room.memory.underAttack = true;
        } else {
            room.memory.underAttack = false;
        }

        if (needsBuilders(room)) {
            room.memory.needsBuilders = true;
        }
        else {
            room.memory.needsBuilders = false;
        }
    }
}


function isUnderAttack(room) {
    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS, {
        filter: creep => {
            for (const part of hostileParts) {
                if (creep.body.includes(part)) {
                    return true;
                }
            }
            return false;
        }
    });
    return hostiles.length >= hostileThreshold;
}


function needsBuilders(room) {
    const sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    if (sites.length === 0) return false;

    if (sites.length <= 3) {
        if (utils.getCreepsOfRole(room.name, "builder") > 0) {
            return false;
        } else return true;
    }
    else if (sites.length >= 4 && sites.length <= 10) {
        if (utils.getCreepsOfRole(room.name, "builder") >= 2) {
            return false;
        } else return true;
    }
    else if (sites >= 11 && sites <= 20) {
        if (utils.getCreepsOfRole(room.name, "builder") >= 3) {
            return false;
        } else return true;
    }
    else {
        if (utils.getCreepsOfRole(room.name, "builder") >= 4) {
            return false;
        } else return true;
    }
}