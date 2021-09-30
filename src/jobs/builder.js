const utils = require("utils");


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "builder")) {
        doActions(creep);
    }
}


function doActions(creep) {
    const sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

    if (sites.length > 0) {
        sites.sort((a, b) => (a.progressTotal - a.progress) - (b.progressTotal - b.progress));

        if (creep.store.getUsedCapacity() === 0) {
            const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_STORAGE
            });
            if (container) {
                const status = creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity());
                if (status === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                    creep.withdraw(container, RESOURCE_ENERGY, container.store.getUsedCapacity())
                }
            }
            else {
                const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
                if (!spawn) return;
                    
                const status = creep.withdraw(spawn, RESOURCE_ENERGY, creep.store.getFreeCapacity());
                if (status === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
                else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                    creep.withdraw(container, RESOURCE_ENERGY, container.store.getUsedCapacity());
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
        const structs = creep.room.find(FIND_MY_STRUCTURES, {
            filter: s => s.hits < s.hitsMax
        });
        if (structs.length === 0) return;
        structs.sort((a, b) => (a.hitsMax - a.hits) - (b.hitsMax - b.hits));

        if (creep.store.getFreeCapacity() === 0) {
            const status = creep.repair(structs[0]);
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveTo(structs[0]);
            }
        }
        else {
            if (creep.store.getUsedCapacity() >= structs[0].hitsMax - structs[0].hits) {
                const status = creep.repair(structs[0]);
                if (status === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structs[0]);
                }
            }
            else {
                if (container) {
                    const status = creep.withdraw(container, RESOURCE_ENERGY, creep.store.getFreeCapacity());
                    if (status === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                    else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                        creep.withdraw(container, RESOURCE_ENERGY, container.store.getUsedCapacity())
                    }
                }
                else {
                    const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
                    if (!spawn) return;
                    
                    const status = creep.widthdraw(spawn, RESOURCE_ENERGY, creep.store.getFreeCapacity());
                    if (status === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                    else if (status === ERR_NOT_ENOUGH_RESOURCES) {
                        creep.withdraw(container, RESOURCE_ENERGY, spawn.store.getUsedCapacity());
                    }
                }
            }
        }
    }
}