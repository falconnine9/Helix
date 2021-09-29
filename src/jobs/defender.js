import { OWNER } from 'globals';


export function allDefenderActions() {
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.owner !== OWNER) continue;
        if (creep.memory.role !== "defender") continue;
        if (creep.spawning) continue;
        doActions(creep);
    }
}


function doActions(creep) {
    const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        const status = creep.attack(hostile);
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile);
        }
    }
}