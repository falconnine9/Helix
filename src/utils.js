module.exports.getCreepsOfRole = (room, role) => {
    let amount = 0;
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];

        if (creep.room.name !== room) continue;
        if (creep.memory.role === role) amount += 1;
    }
    return amount;
}


module.exports.listCreepsOfRole = (room, role) => {
    let creeps = [];
    for (const creepName in Game.creeps) {
        const creep = Game.creeps[creepName];

        if (creep.room.name !== room) continue;
        if (creep.memory.role !== role) continue;
        if (creep.spawning) continue;

        creeps.push(creep);
    }
    return creeps;
}