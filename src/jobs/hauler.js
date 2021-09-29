import { listCreepsOfRole } from '../util';


export function allHaulerActions(room) {
    for (const creep of listCreepsOfRole(room, "hauler")) {
        doActions(creep);
    }
}


function doActions(creep) {
    if (creep.store.getFreeCapacity() === 0) {
        const container = creep.room.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_STORAGE
        });
        if (container) {
            const status = creep.transfer(container, RESOURCE_ENERGY);
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
        }
        else {
            const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
            if (!spawn) return;
            
            const status = creep.transfer(spawn, RESOURCE_ENERGY);
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
        }
    }

    else {
        const resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (!resource) return;

        const status = creep.pickup(resource);
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveTo(resource);
        }
    }
}