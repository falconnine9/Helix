const utils = require("utils");


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "hauler")) {
        doActions(creep);
    }
}


function doActions(creep) {
    if (creep.store.getFreeCapacity() === 0) {
        const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        if (spawn.store.getFreeCapacity() !== 0) {
            const status = creep.transfer(spawn, RESOURCE_ENERGY);
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        }
        else {
            const extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_EXTENSION && s.store.getFreeCapacity() !== 0
            });
            if (extension) {
                const status = creep.transfer(extension, RESOURCE_ENERGY);
                if (status === ERR_NOT_IN_RANGE) {
                    creep.moveTo(extension);
                }
            }
            else {
                const container = creep.room.findClosestByRange(FIND_STRUCTURES, {
                    filter: s => s.structureType === STRUCTURE_STORAGE
                });
                if (container) {
                    const status = creep.transfer(container, RESOURCE_ENERGY);
                    if (status === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            }
        }
    }

    else {
        const resources = creep.room.find(FIND_DROPPED_RESOURCES);
        if (resources.length === 0) return;
        resources.sort((a, b) => a.amount - b.amount);
        resources.reverse()

        const status = creep.pickup(resources[0]);
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveTo(resources[0]);
        }
    }
}