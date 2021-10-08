module.exports.behaviour = creep => {
    if (creep.room.name !== creep.memory.origin) {
        creep.returnToOrigin();
    }

    switch (creep.memory.state) {
        case "sourcing":
            sourcingState(creep);
            break;
        
        case "filling":
            fillingState(creep);
            break;
    }
}


function sourcingState(creep) {
    const resource = Game.getObjectById(creep.memory.resource);
    if (resource) {
        const status = creep.pickup(resource);
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveToInRoom(resource.pos);
        }
    }
    else {
        const allResources = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: r => r.resourceType === RESOURCE_ENERGY
        });
        const tombstones = creep.room.find(FIND_TOMBSTONES);
        allResources.concat(tombstones);
        allResources.sort((a, b) => a.amount - b.amount);
        if (allResources.length > 0) {
            creep.memory.resource = allResources[0].id;
        }
    }

    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.state = "filling";
    }
}


function fillingState(creep) {
    const storeObject = Game.getObjectById(creep.memory.storeObject);
    if (store) {
        if (storeObject.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            creep.memory.storeObject = null;
            return;
        }
        const status = creep.transfer(storeObject, RESOURCE_ENERGY);
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveToInRoom(storeObject.pos);
        }
    }

    else {
        const spawnStructure = creep.pos.findClosestByRange(FIND_MY_SPAWNS, {
            filter: spawn => spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (spawnStructure) {
            creep.memory.storeObject = spawnStructure.id;
            return;
        }

        const extensionStructure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: struct => {
                if (struct.structureType !== STRUCTURE_EXTENSION) return false;
                if (struct.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return false;
                return true;
            }
        });
        if (extensionStructure) {
            creep.memory.storeObject = extensionStructure.id;
            return;
        }

        const storageStructure = creep.room.storage;
        if (storageStructure) {
            creep.memory.storeObject = storageObject.id;
            return;
        }
    }

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        creep.memory.state = "sourcing";
    }
}