declare global {
    interface Tower extends StructureTower {
        memory: TowerMemory;
    }

    interface TowerMemory {
        hostileTarget: Id<Creep> | null;
        friendlyTarget: Id<Creep> | null;
        repairStruct: Id<Structure> | null;
    }
}

const hostileParts = [ATTACK, RANGED_ATTACK, HEAL];

export function towerActions(tower: Tower): void {
    const towerMemory = tower.memory;
    if (tower.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return;

    const hostile = getById(towerMemory.hostileTarget);
    if (hostile) {
        tower.attack(hostile);
        return;
    } else if (towerMemory.hostileTarget) {
        towerMemory.hostileTarget = null;
    }
    const friendly = getById(towerMemory.friendlyTarget);
    if (friendly) {
        tower.heal(friendly);
        return;
    } else if (towerMemory.hostileTarget) {
        towerMemory.hostileTarget = null;
    }
    const repairStruct = getById(towerMemory.repairStruct);
    if (repairStruct) {
        tower.repair(repairStruct);
        return;
    } else if (towerMemory.hostileTarget) {
        towerMemory.hostileTarget = null;
    }

    if (Game.time % 3 === 0) {
        const hostile = findHostile(tower);
        if (hostile) {
            towerMemory.hostileTarget = hostile.id;
            return;
        }
        const friendly = findFriendly(tower);
        if (friendly) {
            towerMemory.friendlyTarget = friendly.id;
            return;
        }
        const repairStruct = findRepairStructure(tower);
        if (repairStruct) {
            towerMemory.repairStruct = repairStruct.id;
            return;
        }
    }
}

function findHostile(tower: Tower): Creep | null {
    const hostiles = tower.room.find(FIND_HOSTILE_CREEPS, {
        filter: creep => !Memory.allies.includes(creep.owner.username)
    });
    if (hostiles.length > 0) {
        hostiles.sort((a, b) => {
            const aMap = a.body.map(c => c.type);
            const bMap = b.body.map(c => c.type);
            let aIsHostile = false;
            let bIsHostile = false;
            for (const hostilePart of hostileParts) {
                if (aMap.includes(hostilePart)) aIsHostile = true;
                if (bMap.includes(hostilePart)) bIsHostile = true;
            }
            if (aIsHostile && !bIsHostile) {
                return -1;
            } else if (!aIsHostile && bIsHostile) {
                return 1;
            } else return 0;
        });
        return hostiles[0];
    } else return null;
}

function findFriendly(tower: Tower): Creep | null {
    const friendlies = tower.room.find(FIND_MY_CREEPS, {
        filter: creep => creep.hits < creep.hitsMax
    });
    if (friendlies.length > 0) {
        friendlies.sort((a, b) => {
            if (a.isCombative() && !b.isCombative()) {
                return -1;
            } else if (!a.isCombative() && b.isCombative()) {
                return 1;
            } else {
                return (a.hitsMax - a.hits) - (b.hitsMax - b.hits);
            }
        });
        return friendlies[0];
    } else return null;
}

function findRepairStructure(tower: Tower): Structure | null {
    const wallHitsLimit = tower.room.memory.wallHitsLimit;
    const repairStructs = tower.room.find(FIND_STRUCTURES, {
        filter: s => {
            if (s.isWall()) {
                return s.hits < wallHitsLimit;
            } else if (s.structureType === STRUCTURE_ROAD) {
                return s.hits < Math.round(s.hitsMax / 1.5);
            } else {
                return s.hits < s.hitsMax;
            }
        }
    });
    if (repairStructs.length > 0) {
        repairStructs.sort((a, b) => (a.hitsMax - a.hits) - (b.hitsMax - b.hits));
        return repairStructs[0];
    } else return null;
}