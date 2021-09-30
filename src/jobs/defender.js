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
}