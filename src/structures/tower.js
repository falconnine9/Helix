module.exports.behaviour = tower => {
    const status = handleDefending(tower);
    if (status) return;

    const status = handleHealing(tower);
    if (status) return;

    handleRepairing(tower);
}


function handleDefending(tower) {
    if (tower.memory.hostile) {
        const hostile = Game.getObjectById(tower.memory.hostile);
        if (hostile) {
            tower.attack(hostile);
            return true;
        }
        tower.memory.hostile = null;
    }

    const hostileCreep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: c => !Memory.allies.includes(c.owner.username)
    });
    if (hostileCreep) {
        tower.memory.hostile = hostileCreep.id;
        tower.attack(hostileCreep);
        return true;
    }
    else return false;
}


function handleHealing(tower) {
    if (tower.memory.friendly) {
        const friendly = Game.getObjectById(tower.memory.friendly);
        if (friendly) {
            tower.heal(friendly);
            return true;
        }
        tower.memory.friendly = null;
    }

    const friendlies = tower.room.find(FIND_MY_CREEPS, {
        filter: c => c.hits < c.hitsMax
    });
    if (friendlies.length > 0) {
        friendlies.sort((a, b) => (a.hitsMax - a.hits) - (b.hitsMax - b.hits));
        tower.memory.friendly = friendlies[0].id;
        tower.heal(friendlies[0]);
        return true;
    }
    else return false;
}


function handleRepairing(tower) {
    if (tower.memory.repairStruct) {
        const repairStruct = Game.getObjectById(tower.memory.repairStruct);
        if (repairStruct) {
            tower.repair(repairStruct);
            return;
        }
        tower.memory.repairStruct = null;
    }

    const structs = tower.room.find(FIND_STRUCTURES, {
        filter: s => s.hits < s.hitsMax
    });
    if (structs.length > 0) {
        structs.sort((a, b) => (a.hitsMax - a.hits) - (b.hitsMax - b.hits));
        tower.memory.repairStruct = structs[0].id;
        tower.repair(structs[0]);
    }
}