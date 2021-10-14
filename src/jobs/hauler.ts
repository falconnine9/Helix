declare global {
    interface Hauler extends Creep {
        memory: HaulerMemory;
    }

    interface HaulerMemory extends CreepMemory {
        role: "hauler";
        resource: Id<Resource | Tombstone> | null;
        container: Id<StructureSpawn | StructureExtension | StructureStorage> | null;
        state: "sourcing" | "filling";
    }
}

export const haulerMemory: HaulerMemory = {
    role: "hauler",
    resource: null,
    container: null,
    state: "sourcing"
};

export const haulerBodies: BodyPartConstant[][] = [
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    [CARRY, CARRY, MOVE]
];

export function haulerActions(creep: Creep): void {
    const hauler = creep as Hauler;
    switch (hauler.memory.state) {
        case "sourcing":
            sourcingState(hauler);
            break;

        case "filling":
            fillingState(hauler);
            break;
    }
}

function sourcingState(hauler: Hauler): void {
    const creepMemory = hauler.memory;
    const resource = getById(creepMemory.resource);

    if (resource) {
        if (hauler.pos.isNearTo(resource)) {
            if (resource instanceof Resource) {
                hauler.pickup(resource);
            } else {
                hauler.withdraw(resource, RESOURCE_ENERGY);
            }
        } else {
            hauler.travelTo(resource, 5);
        }
    }
    else {
        if (Game.time % 3 !== 0) return;
        const resource = findResource(hauler);
        if (resource) {
            creepMemory.resource = resource.id;
        } else hauler.wander();
    }

    if (hauler.energyCapacity() === 0) {
        const containerStruct = findContainer(hauler);
        creepMemory.container = containerStruct ? containerStruct.id : null;
        creepMemory.resource = null;
        creepMemory.state = "filling";
    }
}

function fillingState(hauler: Hauler): void {
    const creepMemory = hauler.memory;
    const container = getById(creepMemory.container);

    if (container) {
        if (container.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            creepMemory.container = null;
            return;
        }
        if (hauler.pos.isNearTo(container)) {
            hauler.transfer(container, RESOURCE_ENERGY);
        } else {
            hauler.travelTo(container);
        }
    }
    else {
        if (Game.time % 3 !== 0) return;
        const containerStruct = findContainer(hauler);
        if (containerStruct) {
            creepMemory.container = containerStruct.id;
        } else hauler.wander();
    }

    if (hauler.energyAmount() === 0) {
        const resource = findResource(hauler);
        creepMemory.resource = resource ? resource.id : null;
        creepMemory.container = null;
        creepMemory.state = "sourcing";
    }
}

function findResource(hauler: Hauler): Resource<ResourceConstant> | Tombstone | null {
    const resources: (Resource<ResourceConstant> | Tombstone)[] = hauler.room.find(FIND_DROPPED_RESOURCES);
    resources.concat(hauler.room.find(FIND_TOMBSTONES, {
        filter: tomb => tomb.energyAmount() > 0
    }));
    if (resources.length > 0) {
        resources.sort((a, b) => {
            let aEnergy;
            let bEnergy;
            if (a instanceof Resource) aEnergy = a.amount;
            else aEnergy = a.energyAmount();
            if (b instanceof Resource) bEnergy = b.amount;
            else bEnergy = b.energyAmount();
            return aEnergy - bEnergy;
        });
        resources.reverse();
        return resources[0];
    } else return null;
}

function findContainer(hauler: Hauler): StructureSpawn | StructureExtension | StructureStorage | null {
    const spawns = hauler.room.find(FIND_MY_SPAWNS, {
        filter: s => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });
    if (spawns.length > 0) {
        spawns.sort((a, b) => {
            const aStore = a.store.getFreeCapacity(RESOURCE_ENERGY);
            const bStore = b.store.getFreeCapacity(RESOURCE_ENERGY);
            return aStore - bStore;
        });
        return spawns[0];
    }

    const extensions: StructureExtension[] = hauler.room.find(FIND_MY_STRUCTURES, {
        filter: s => {
            if (s.structureType !== STRUCTURE_EXTENSION) return false;
            return s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        }
    });
    if (extensions.length > 0) {
        extensions.sort((a, b) => {
            const aStore = a.store.getFreeCapacity(RESOURCE_ENERGY);
            const bStore = b.store.getFreeCapacity(RESOURCE_ENERGY);
            return aStore - bStore;
        });
        return extensions[0];
    }

    const storage = hauler.room.storage;
    if (storage) {
        return storage;
    }

    return null;
}