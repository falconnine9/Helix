module.exports.behaviour = creep => {
    if (creep.room.name !== creep.memory.origin) {
        creep.returnToOrigin();
    }

    switch (creep.memory.state) {
        case "gathering":
            gatheringState(creep);
            break;

        case "supplying":
            supplyingState(creep);
            break;
    }
}


function gatheringState(creep) {
    const storage = creep.room.storage;
    if (!store) return;

    const status = creep.withdraw(storage, RESOURCE_ENERGY);
    if (status === ERR_NOT_IN_RANGE) {
        creep.moveToInRoom(storage.pos);
    }

    if (creep.store.getFreeCapacity() === 0) {
        creep.memory.supplyStructure = null;
        creep.memory.state = "supplying";
    }
}


function supplyingState(creep) {
    const supplyStructure = Game.getObjectById(creep.memory.supplyStructure);
    if (supplyStructure) {
        if (supplyStructure.store.getFreeCapacity() === 0) {
            creep.memory.supplyStructure = null;
            return;
        }
        const status = creep.transfer(supplyStructure)
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveToInRoom(supplyStructure.pos);
        }
    }
    else {
        const towers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        if (towers.length === 0) {
            const spawns = creep.room.find(FIND_MY_SPAWNS, {
                filter: s => s.store.getFreeCapacity() > 0
            });
            if (spawns.length === 0) {
                const extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: s => s.store.getFreeCapacity() > 0
                });
                if (extension) {
                    creep.memory.supplyStructure = extension.id;
                }
            }
            else {
                spawns.sort((a, b) => {
                    const aStore = a.store.getUsedCapacity(RESOURCE_ENERGY);
                    const bStore = b.store.getUsedCapacity(RESOURCE_ENERGY);
                    return aStore - bStore;
                });
                creep.memory.supplyStructure = spawns[0].id;
            }
        }
        else {
            towers.sort((a, b) => {
                const aStore = a.store.getUsedCapacity(RESOURCE_ENERGY);
                const bStore = a.store.getUsedCapacity(RESOURCE_ENERGY);
                return aStore - bStore;
            });
            creep.memory.supplyStructure = towers[0].id;
        }
    }

    if (creep.store.getUsedCapacity() === 0) {
        creep.memory.state = "gathering";
    }
}