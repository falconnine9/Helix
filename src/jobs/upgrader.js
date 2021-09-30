const utils = require("utils");


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "upgrader")) {
        doActions(creep);
    }
}


function doActions(creep) {
    if (creep.store.getUsedCapacity() === 0) {
        const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_STORAGE
        });
        if (container) {
            const status = creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity());
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
        }
        else {
            const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
            if (!spawn) return;
            if (spawn.memory.needsEnergy) return;
                    
            const status = creep.withdraw(spawn, RESOURCE_ENERGY, creep.store.getFreeCapacity());
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
            else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                creep.withdraw(container, RESOURCE_ENERGY, spawn.store.getUsedCapacity());
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