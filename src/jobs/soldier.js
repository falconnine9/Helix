const utils = require("utils");


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "soldier")) {
        doActions(creep);
    }
}


function doActions(creep) {
    let flag;
    for (const flagName in Game.flags) {
        const flagIter = Game.flags[flagName];
        if (flagIter.name.startsWith("attack")) {
            flag = flagIter;
            break;
        }
    } 
    if (!flag) return;
    
    if (creep.room.name === flag.pos.roomName) {
        const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile) {
            attackHostile(creep, hostile);
        }
        else {
            const spawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
            if (spawn) {
                attackHostile(creep, spawn);
            }
        }
    }

    else {
        let exit = Game.map.findExit(
            creep.room.name,
            flag.pos.roomName,
            (roomName, fromRoom) => {
                if (!(roomName in Memory.scoutInfo)) return 1;
                if (Memory.scoutInfo[roomName].sourceKeepers > 0) return Infinity;
                return 1;
            }
        );
        if (exit === ERR_NO_PATH) {
            exit = Game.map.findExit(creep.room.name, flag.pos.roomName);
            if (exit === ERR_NO_PATH) return;
        }
        creep.moveTo(creep.pos.findClosestByRange(exit));
    }
}


function attackHostile(creep, hostile) {
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