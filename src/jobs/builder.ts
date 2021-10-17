declare global {
    interface Builder extends Creep {
        memory: BuilderMemory;
    }

    interface BuilderMemory extends CreepMemory {
        role: "builder";
        container: Id<StructureSpawn | StructureStorage> | null;
        constructionSite: Id<ConstructionSite> | null;
        repairingSite: Id<Structure> | null;
        state: "building" | "repairing" | "getting";
    }
}

export const builderMemory: BuilderMemory = {
    role: "builder",
    container: null,
    constructionSite: null,
    repairingSite: null,
    state: "building"
};

export const builderBodies: Body[] = [
    [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    [WORK, CARRY, CARRY, MOVE, MOVE],
    [WORK, CARRY, MOVE]
];

export function builderActions(creep: Creep): void {
    const builder = creep as Builder;
    switch (builder.memory.state) {
        case "building":
            buildingState(builder);
            break;

        case "repairing":
            repairingState(builder);
            break;

        case "getting":
            gettingState(builder);
            break;
    }
}

function buildingState(builder: Builder): void {
    const creepMemory = builder.memory;
    const site = getById(creepMemory.constructionSite);

    if (site) {
        if (site.progress === site.progressTotal) {
            creepMemory.constructionSite = null;
            return;
        }
        if (builder.pos.inRangeTo(site, 3)) {
            builder.build(site);
        } else {
            builder.travelTo(site);
        }
    }
    else {
        if (Game.time % 5 !== 0) return;
        const sites = builder.room.find(FIND_CONSTRUCTION_SITES);
        if (sites.length > 0) {
            sites.sort((a, b) => {
                const aDelta = a.progressTotal - a.progress;
                const bDelta = b.progressTotal - b.progress;
                return aDelta - bDelta;
            });
            creepMemory.constructionSite = sites[0].id;
        }
        else {
            const towerAmount = builder.room.find(FIND_MY_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_TOWER
            }).length;
            if (towerAmount === 0) {
                builder.setState("repairing");
                return;
            }
            builder.wander();
        }
    }

    if (builder.energyAmount() === 0) {
        builder.setState("getting");
    }
}

function repairingState(builder: Builder): void {
    const creepMemory = builder.memory;
    const wallHitsLimit = builder.room.memory.wallHitsLimit;
    const site = getById(creepMemory.repairingSite);

    if (site) {
        if (site.isWall() && site.hits >= wallHitsLimit) {
            creepMemory.repairingSite = null;
            return;
        } else if (site.hits === site.hitsMax) {
            creepMemory.repairingSite = null;
            return;
        }
        if (builder.pos.inRangeTo(site, 3)) {
            builder.repair(site);
        } else {
            builder.travelTo(site);
        }
    }
    else {
        if (Game.time % 4 !== 0) return;
        const repairSites = builder.room.find(FIND_STRUCTURES, {
            filter: s => {
                if (s.isWall()) {
                    return s.hits < wallHitsLimit;
                } else if (s.structureType === STRUCTURE_ROAD) {
                    return s.hits < Math.round(s.hitsMax / 2);
                } else {
                    return s.hits < s.hitsMax;
                }
            }
        });
        if (repairSites.length > 0) {
            creepMemory.repairingSite = repairSites[0].id;
        } else builder.wander();
    }

    if (builder.energyAmount() === 0) {
        builder.setState("getting");
    }
}

function gettingState(builder: Builder): void {
    const creepMemory = builder.memory;
    const container = getById(creepMemory.container);

    if (container) {
        if (container instanceof StructureSpawn) {
            if (builder.room.storage) {
                creepMemory.container = null;
                return;
            }
            if (container.memory.needsEnergy) return;
        }
        if (builder.pos.isNearTo(container)) {
            builder.withdraw(container, RESOURCE_ENERGY);
        } else {
            builder.travelTo(container);
        }
    }
    else {
        if (Game.time % 3 !== 0) return;
        const storage = builder.room.storage;
        if (storage) {
            creepMemory.container = storage.id;
            return;
        }
        const spawn = builder.pos.findClosestByRange(FIND_MY_SPAWNS, {
            filter: s => {
                if (s.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;
                return !s.memory.needsEnergy;
            }
        });
        if (spawn) {
            creepMemory.container = spawn.id;
        }
        else builder.wander();
    }

    if (builder.energyCapacity() === 0) {
        creepMemory.container = null;
        if (creepMemory.repairingSite && !creepMemory.constructionSite) {
            builder.setState("repairing");
        } else {
            builder.setState("building");
        }
    }
}