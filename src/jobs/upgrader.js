import { listCreepsOfRole } from '../util';

const ENERGY_THRESHOLD = 1000;


export function allUpgraderActions(room) {
    for (const creep of listCreepsOfRole(room, "upgrader")) {
        doActions(creep);
    }
}


function doActions(creep) {
    if (creep.store.getUsedCapacity() === 0) {
        const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_STORAGE
        });
        if (!container) return;

        const status = creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity());
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
        }
    }
    
    else {
        const status = creep.upgradeController(creep.room.controller);
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}