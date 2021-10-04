const utils = require("utils");


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "soldier")) {
        doActions(creep);
    }
}


function doActions() {
    let flag;
    for (const flagName in Game.flags) {
        const flagIter = Game.flags[flagIter];
        if (flagIter.name.startsWith("attack")) {
            flag = flagIter;
            break;
        }
    } 
    if (!flag) return;
    
    if (creep.room.name === flag.pos.roomName) {
        const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (!hostile) return;

        const status = creep.attack(hostile);
        if (status === ERR_NOT_IN_RANGE) {
            if (creep.body.includes(RANGED_ATTACK)) {
                const secondaryStatus = creep.rangedAttack(hostile);
                if (secondaryStatus == ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostile);
                }
            } else {
                creep.moveTo(hostile);
            }
        }
    }

    else {
        const exit = Game.map.findExit(creep.room.name, flag.pos.roomName);
        creep.moveTo(creep.pos.findClosestByRange(exit));
    }
}