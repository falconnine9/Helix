const utils = require("utils");
const energyThreshold = 1000;


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
        if (!container) return;

        if (container.store.getUsedCapacity() > energyThreshold) {
            const status = creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity());
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
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