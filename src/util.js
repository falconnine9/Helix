import { OWNER } from 'globals';


export function getCreepsOfRole(room, role) {
    let amount = 0;
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];

        if (creep.owner !== OWNER) continue;
        if (creep.room.name === room) continue;
        if (creep.memory.role === role) amount += 1;
    }
    return amount;
}


export function listCreepsOfRole(room, role) {
    let creeps = [];
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];

        if (creep.owner !== OWNER) continue;
        if (creep.room.name !== room) continue;
        if (creep.memory.role !== role) continue;
        if (creep.spawning) continue;

        creeps.push(creep);
    }
    return creeps;
}


export function listSpawnsInRoom(room) {
    let spawns = [];
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawn];

        if (spawn.owner !== OWNER) continue;
        if (spawn.room.name !== room) continue;

        spawns.push(spawn);
    }
    return spawns;
}