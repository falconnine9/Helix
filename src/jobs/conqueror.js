const utils = require("utils");


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "conqueror")) {
        doActions(creep);
    }
}


function doActions(creep) {
    let flag;
    for (const flagName in Game.flags) {
        const flagIter = Game.flags[flagName];
        if (flagIter.name.startsWith("conquer")) {
            flag = flagIter;
            break;
        }
    }
    if (!flag) return;

    if (creep.room.name === flag.pos.roomName) {
        const status = creep.claimController(creep.room.controller);
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
    else {
        const direction = Game.map.findExit(creep.room.name, flag.pos.roomName);
        creep.moveTo(creep.pos.findClosestByRange(direction));
    }
}