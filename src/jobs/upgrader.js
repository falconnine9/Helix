module.exports.behaviour = creep => {
    if (creep.room.name !== creep.memory.origin) {
        creep.returnToOrigin();
    }

    switch (creep.memory.state) {
        case "gathering":
            gatheringState(creep);
            break;
        
        case "upgrading":
            upgradingState(creep);
            break;
    }
}


function gatheringState(creep) {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.state = "upgrading";
        return;
    }

    const container = Game.getObjectById(creep.memory.container);
    if (container) {
        if (container.structureType === STRUCTURE_SPAWN && container.memory.needsEnergy) return;
        const status = creep.withdraw(container, RESOURCE_ENERGY);
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveToInRoom(container.pos);
        }
    }
    else {
        const storageStructure = creep.room.storage;
        if (storageStructure) {
            creep.memory.container = storageStructure.id;
        }
        else {
            const spawnStructure = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
            if (spawnStructure) {
                creep.memory.container = spawnStructure.id;
            }
        }
    }
}


function upgradingState(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.container = null;
        creep.memory.state = "gathering";
        return;
    }

    const status = creep.upgradeController(creep.room.controller);
    if (status === ERR_NOT_IN_RANGE) {
        creep.moveToInRoom(creep.room.controller.pos);
    }
}