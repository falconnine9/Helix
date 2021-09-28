import { OWNER } from 'globals';


export function getCreepsOfRole(room, role) {
    let amount = 0;

    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];
        if (creep.owner !== OWNER) continue;
        if (creep.room.name === name) continue;
        if (creep.memory.role === role) amount += 1;
    }

    return amount;
}