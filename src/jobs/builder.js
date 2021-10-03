const utils = require("utils");
const allConfig = require("config").config;


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "builder")) {
        doActions(creep);
    }
}


function doActions(creep) {
    const sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    let config;
    if (creep.room.name in allConfig) {
        config = allConfig[creep.room.name];
    } else {
        config = allConfig["global"];
    }

    if (sites.length > 0) {
        sites.sort((a, b) => (a.progressTotal - a.progress) - (b.progressTotal - b.progress));

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_STORAGE
            });
            if (container) {
                const status = creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY));
                if (status === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                    creep.withdraw(container, RESOURCE_ENERGY, container.store.getUsedCapacity(RESOURCE_ENERGY))
                }
            }
            else {
                const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
                if (!spawn) return;
                if (spawn.memory.needsEnergy) return;
                    
                const status = creep.withdraw(spawn, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY));
                if (status === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
                else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                    creep.withdraw(spawn, RESOURCE_ENERGY, spawn.store.getUsedCapacity(RESOURCE_ENERGY));
                }
            }
        }
        else {
            const status = creep.build(sites[0]);
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(sites[0]);
            }
        }
    }

    else {
        if (!creep.memory.repairStruct) {
            const structs = creep.room.find(FIND_STRUCTURES, {
                filter: s => {
                    if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
                        return s.hits < config.wallLimit;
                    } else {
                        return s.hits <= Math.round(s.hitsMax / 2);
                    }
                }
            });
            if (structs.length === 0) return;
            structs.sort((a, b) => (a.hitsMax - a.hits) - (b.hitsMax - b.hits));
            structs.reverse();
            creep.memory.repairStruct = structs[0].id;
        }
        const struct = Game.getObjectById(creep.memory.repairStruct);
        if (!struct) {
            creep.memory.repairStruct = null;
            return;
        }

        if (struct.structureType === STRUCTURE_WALL || struct.structureType === STRUCTURE_RAMPART) {
            if (struct.hits >= config.wallLimit) {
                creep.memory.repairStruct = null;
            }
        } else {
            if (struct.hits === struct.hitsMax) {
                creep.memory.repairStruct = null;
            }
        }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) >= struct.hitsMax - struct.hits) {
                const status = creep.repair(struct);
                if (status === ERR_NOT_IN_RANGE) {
                    creep.moveTo(struct);
                }
            }
            else {
                const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: s => s.structureType === STRUCTURE_STORAGE
                });
                if (container) {
                    const status = creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY));
                    if (status === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                    else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                        creep.withdraw(container, RESOURCE_ENERGY, container.store.getUsedCapacity(RESOURCE_ENERGY));
                    }
                }
                else {
                    const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
                    if (!spawn) return;
                    if (spawn.memory.needsEnergy) return;
                    
                    const status = creep.withdraw(spawn, RESOURCE_ENERGY, creep.store.getFreeCapacity(RESOURCE_ENERGY));
                    if (status === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                    else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                        creep.withdraw(container, RESOURCE_ENERGY, spawn.store.getUsedCapacity(RESOURCE_ENERGY));
                    }
                }
            }
        }
        else {
            const status = creep.repair(struct);
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(struct);
            }
        }
    }
}