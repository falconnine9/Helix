module.exports.behaviour = creep => {
    if (creep.room.name !== creep.memory.origin) {
        creep.returnToOrigin();
    }

    switch (creep.memory.state) {
        case "mining":
            miningState(creep);
            break;
    }
}


function miningState(creep) {
    if (creep.memory.source) {
        const source = Game.getObjectById(creep.memory.source);
        const status = creep.harvest(source);

        if (status === ERR_NOT_IN_RANGE) {
            creep.moveToInRoom(source.pos);
        }
        else if (status === ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.source = null;
        }
    }
    else {
        const source = creep.pos.findClosestByRange(FIND_ACTIVE_SOURCES);
        if (source) {
            creep.memory.source = source.id;
        }
    }
}