import { OWNER } from 'globals';


export function allHarvesterActions() {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.owner !== OWNER) continue;
        if (creep.memory.role !== "harvester") continue;
        if (creep.spawning) continue;
        doActions(creep);
    }
}


function doActions(creep) {
    const source = creep.pos.findClosestByRange(FIND_SOURCES);
    if (!source) return;

    const status = creep.harvest(source);
    if (status === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }
}