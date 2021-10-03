const utils = require("utils");


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "upgrader")) {
        doActions(creep);
    }
}


function doActions(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        const container = creep.room.storage;
        if (container) {
            const status = creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY));
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
        const status = creep.upgradeController(creep.room.controller);
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}