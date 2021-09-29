import { OWNER } from 'globals';


export function allBuilderActions() {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.owner !== OWNER) continue;
        if (creep.memory.role !== "builder") continue;
        if (creep.spawning) continue;
        doActions(creep);
    }
}


function doActions(creep) {
    const sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    if (sites.length === 0) return;
    sites = sites.sort((s) => {return s.progressTotal - s.progress})

    if (creep.store.getFreeCapacity() === 0) {
        const status = creep.build(sites[0]);
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveTo(sites[0]);
        }
    }
    else {
        if (creep.store.getUsedCapacity() >= sites[0].progressTotal - sites[0].progress) {
            const status = creep.build(sites[0]);
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(sites[0]);
            }
        }
        else {
            const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_STORAGE
            });
            if (container) {
                const status = creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity());
                if (status === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                    creep.withdraw(container, RESOURCE_ENERGY, container.store.getUsedCapacity())
                }
            }
            else {
                const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
                if (!spawn) return;
                
                const status = creep.widthdraw(spawn, RESOURCE_ENERGY, creep.store.getFreeCapacity());
                if (status === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
                else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                    creep.withdraw(container, RESOURCE_ENERGY, container.store.getUsedCapacity());
                }
            }
        }
    }
}