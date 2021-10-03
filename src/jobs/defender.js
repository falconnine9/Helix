const utils = require("utils");
const allConfig = require("config").config;


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
        let config;
        if (creep.room.name in allConfig) {
            config = allConfig[creep.room.name];
        } else {
            config = allConfig["global"];
        }
        if (creep.room.controller.sign.username !== config.owner) {
            const status = creep.signController(creep.room.controller, config.signText);
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            if (creep.memory.patrolLocation) {
                const x = creep.memory.patrolLocation[0];
                const y = creep.memory.patrolLocation[1];

                if (creep.pos.x === x && creep.pos.y === y) {
                    creep.memory.patrolLocation = null;
                } else {
                    creep.moveTo(x, y);
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
}