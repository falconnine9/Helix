module.exports.allActions = (room) => {
    for (const tower of room.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER
    })) {
        doActions(tower);
    }
}


function doActions(tower) {
    const hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        const status = tower.attack(hostile);
        if (status === ERR_NOT_ENOUGH_ENERGY) {
            tower.memory.needsEnergy = true;
        }
        else {
            if (tower.store.getUsedCapacity() === 0) {
                tower.memory.needsEnergy = true;
            }
        }
    }

    else {
        const friendly = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: c => c.hits < c.hitsMax
        });
        if (friendly) {
            const status = tower.heal(friendly);
            if (status === ERR_NOT_ENOUGH_ENERGY) {
                tower.memory.needsEnergy = true;
            }
            else {
                if (tower.store.getUsedCapacity() === 0) {
                    tower.memory.needsEnergy = true;
                }
            }
        }
    }
}