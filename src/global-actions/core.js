const utils = require("utils");

const hostileParts = [ATTACK, RANGED_ATTACK, HEAL, CLAIM];
const hostileThreshold = 4;
const siteCost = 600;


module.exports.determineCreepNumbers = () => {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        isUnderAttack(room);
        needsBuilders(room);
    }
}


function isUnderAttack(room) {
    const hostiles = room.find(FIND_HOSTILE_CREEPS, {
        filter: creep => {
            for (const part of hostileParts) {
                if (creep.body.includes(part)) {
                    return true;
                }
            }
            return false;
        }
    });
    if (hostiles.length >= hostileThreshold && !room.memory.isUnderAttack) {
        room.memory.isUnderAttack = true;
        room.memory.config.maxCreeps.defender += 3;
        room.memory.config.maxCreeps.filler += 1;
    }
    else if (hostiles.length <= hostileThreshold && room.memory.isUnderAttack) {
        room.memory.isUnderAttack = false;
        room.memory.config.maxCreeps.defender -= 3;
        room.memory.config.maxCreeps.filler -= 1;
    }
}


function needsBuilders(room) {
    let siteTotalCost = 0;
    const sites = room.find(FIND_MY_CONSTRUCTION_SITES);
    if (sites.length === 0) return;

    for (const site of sites) {
        siteTotalCost += site.progressTotal - site.progress;
    }
    
    const siteAmount = Math.ceil(siteTotalCost / siteCost);
    let currentBuilders = room.memory.config.maxCreeps.builder;
    if (siteAmount <= 6) {
        if (currentBuilders === 0) {
            room.memory.config.maxCreeps.builder = 1;
        }
    }
    else if (siteAmount >= 7 && siteAmount <= 12) {
        if (currentBuilders < 2 || currentBuilders > 2) {
            room.memory.config.maxCreeps.builder = 2;
        }
    }
    else if (siteAmount >= 13 && siteAmount <= 25) {
        if (currentBuilders < 3 || currentBuilders > 3) {
            room.memory.config.maxCreeps.builder = 3;
        }
    }
    else {
        if (currentBuilders < 4) {
            room.memory.config.maxCreeps.builder = 4;
        }
    }
}