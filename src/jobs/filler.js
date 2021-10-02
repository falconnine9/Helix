const utils = require("utils");


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "filler")) {
        doActions(creep);
    }
}


function doActions(creep) {
    const structs = creep.room.find(FIND_MY_STRUCTURES, {
        filter: s => {
            if (s.structureType !== STRUCTURE_TOWER) {
                return false;
            } else if (s.store.getUsedCapacity(RESOURCE_ENERGY) >= s.store.getCapacity(RESOURCE_ENERGY)) {
                return false;
            } else {
                return true;
            }
        }
    });
    if (structs.length === 0) return;
    structs.sort((a, b) => {
        const aDiff = a.store.getCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY);
        const bDiff = b.store.getCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY);
        return aDiff - bDiff;
    });

    if (creep.store.getFreeCapacity() === 0) {
        const status = creep.transfer(structs[0], RESOURCE_ENERGY);
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveTo(structs[0]);
        }
    }
    else {
        const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_STORAGE
        });

        if (container) {
            const status = creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY));
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
            else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                creep.withdraw(container, RESOURCE_ENERGY, spawn.store.getUsedCapacity(RESOURCE_ENERGY));
            }
        }
    }
}