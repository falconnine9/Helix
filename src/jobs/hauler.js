import { OWNER } from 'globals';


export function allHaulerActions() {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.owner !== OWNER) continue;
        if (creep.memory.role === "hauler") continue;
        if (creep.spawning) continue;
        doActions(creep);
    }
}


function doActions(creep) {
    if (creep.store.getFreeCapacity() === 0) {

        const container = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_STORAGE
        });
        if (container) {
            const status = creep.transfer(container, RESOURCE_ENERGY);
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
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