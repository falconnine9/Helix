const utils = require("utils");


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "defender")) {
        doActions(creep);
    }
}


function doActions(creep) {
    if (creep.room.name !== creep.memory.origin) {
        const direction = Game.map.findExit(creep.room.name, creep.memory.origin);
        creep.moveTo(creep.pos.findClosestByRange(direction));
        return;
    }

    const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        const status = creep.attack(hostile);
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile);
        }
    }
    else {
        const config = utils.getConfig(creep);
        if (creep.room.controller.sign.username !== config.owner) {
            const status = creep.signController(creep.room.controller, config.signText);
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            creep.wander();
        }
    }
}