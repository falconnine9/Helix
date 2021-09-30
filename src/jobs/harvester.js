const utils = require("utils");


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "harvester")) {
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