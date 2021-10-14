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
        const hostiles = tower.room.find(FIND_HOSTILE_CREEPS, {
            filter: creep => !Memory.allies.includes(creep.owner.username)
        });
        if (hostiles.length > 0) {
            towerMemory.hostileTarget = hostiles[0].id;
            return
        }
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
            towerMemory.friendlyTarget = friendlies[0].id;
            return;
        }
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
            towerMemory.repairStruct = repairStructs[0].id;
        }
    }
}