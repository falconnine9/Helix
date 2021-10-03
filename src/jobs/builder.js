const utils = require("utils");
const allConfig = require("config").config;


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "builder")) {
        doActions(creep);
    }
}


function doActions(creep) {
    const sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    let config;
    if (creep.room.name in allConfig) {
        config = allConfig[creep.room.name];
    } else {
        config = allConfig["global"];
    }

    if (sites.length > 0 && creep.room.name === creep.memory.origin) {
        sites.sort((a, b) => (a.progressTotal - a.progress) - (b.progressTotal - b.progress));

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            const container = creep.room.storage;
            if (container) {
                const status = creep.withdraw(container, RESOURCE_ENERGY);
                if (status === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
            else {
                const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
                if (!spawn) return;
                if (spawn.memory.needsEnergy) return;
                    
                const status = creep.withdraw(spawn, RESOURCE_ENERGY);
                if (status === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            }
        }
        else {
            const status = creep.build(sites[0]);
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(sites[0]);
            }
        }
    }

    else {
        let remoteSite;
        for (const roomName in Game.rooms) {
            const roomIter = Game.rooms[roomName];
            const iterSites = roomIter.find(FIND_MY_CONSTRUCTION_SITES, {
                filter: s => s.structureType === STRUCTURE_SPAWN
            });
            if (iterSites.length > 0) {
                remoteSite = iterSites[0];
                break;
            }
        }
        if (!remoteSite) return;
        const home = Game.rooms[creep.memory.origin];

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            const container = home.storage;
            if (container) {
                const status = creep.withdraw(container, RESOURCE_ENERGY);
                if (status === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            } else return;
        }
        else {
            const status = creep.build(remoteSite);
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(remoteSite);
            }
        }
    }
}