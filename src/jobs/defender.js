const utils = require("utils");


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "defender")) {
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
    else {
        if (creep.memory.patrolLocation) {
            const x = creep.memory.patrolLocation[0];
            const y = creep.memory.patrolLocation[1];
            creep.moveTo(x, y);

            if (creep.pos.x === x && creep.pos.y === y) {
                creep.memory.patrolLocation = null;
            }
        }
        else {
            const terrain = Game.map.getRoomTerrain(creep.room.name);
            let iteration = 0;

            let randX = Math.round((Math.random() * 48) + 1);
            let randY = Math.round((Math.random() * 48) + 1);
            while (terrain.get(randX, randY) !== 0) {
                if (iteration === 10) return;
                iteration += 1;

                randX = Math.round((Math.random() * 48) + 1);
                randY = Math.round((Math.random() * 48) + 1);
            }

            creep.memory.patrolLocation = [randX, randY];
        }
    }
}