declare global {
    interface Upgrader extends Creep {
        memory: UpgraderMemory;
    }

    interface UpgraderMemory extends CreepMemory {
        role: "upgrader";
        container: Id<StructureSpawn | StructureStorage> | null;
        state: "getting" | "upgrading";
    }
}

export const upgraderMemory: UpgraderMemory = {
    role: "upgrader",
    container: null,
    state: "getting"
};

export const upgraderBodies: BodyPartConstant[][] = [
    [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    [WORK, CARRY, CARRY, MOVE, MOVE],
    [WORK, CARRY, MOVE]
];

export function upgraderActions(creep: Creep): void {
    const upgrader = creep as Upgrader;
    switch (upgrader.memory.state) {
        case "getting":
            gettingState(upgrader);
            break;

        case "upgrading":
            upgradingState(upgrader);
            break;
    }
}

function gettingState(upgrader: Upgrader): void {
    const creepMemory = upgrader.memory;
    const container = getById(creepMemory.container);

    if (container) {
        if (container instanceof StructureSpawn) {
            if (upgrader.room.storage) {
                creepMemory.container = null;
                return;
            }
            if (container.memory.needsEnergy) return;
        }
        if (upgrader.pos.isNearTo(container)) {
            upgrader.withdraw(container, RESOURCE_ENERGY);
        } else {
            upgrader.travelTo(container);
        }
    }
    else {
        if (Game.time % 3 !== 0) return;
        const containerStruct = findContainer(upgrader);
        if (containerStruct) {
            creepMemory.container = containerStruct.id;
        }
    }

    if (upgrader.energyCapacity() === 0) {
        creepMemory.container = null;
        creepMemory.state = "upgrading";
    }
}

function upgradingState(upgrader: Upgrader) {
    const creepMemory = upgrader.memory;
    const controller = upgrader.room.controller;

    if (controller) {
        if (upgrader.pos.inRangeTo(controller, 3)) {
            upgrader.upgradeController(controller);
        } else {
            upgrader.travelTo(controller);
        }
    }

    if (upgrader.energyAmount() === 0) {
        const containerStruct = findContainer(upgrader);
        creepMemory.container = containerStruct ? containerStruct.id : null;
        creepMemory.state = "getting";
    }
}

function findContainer(upgrader: Upgrader): StructureSpawn | StructureStorage | null {
    const storage = upgrader.room.storage;
        if (storage) {
            return storage;
        }
        const spawn = upgrader.pos.findClosestByRange(FIND_MY_SPAWNS, {
            filter: s => {
                if (s.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;
                return !s.memory.needsEnergy;
            }
        });
        if (spawn) {
            return spawn;
        }
        return null;
}