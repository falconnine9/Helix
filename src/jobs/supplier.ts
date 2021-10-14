declare global {
    interface Supplier extends Creep {
        memory: SupplierMemory;
    }

    interface SupplierMemory extends CreepMemory {
        role: "supplier";
        fillStructure: Id<StructureTower | StructureSpawn | StructureExtension> | null;
        state: "filling" | "getting";
    }
}

export const supplierMemory: SupplierMemory = {
    role: "supplier",
    fillStructure: null,
    state: "getting"
};

export const supplierBodies: BodyPartConstant[][] = [
    [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    [CARRY, CARRY, CARRY, MOVE, MOVE],
    [CARRY, MOVE]
];

export function supplierActions(creep: Creep) {
    const supplier = creep as Supplier;
    switch (supplier.memory.state) {
        case "filling":
            fillingState(supplier);
            break;

        case "getting":
            gettingState(supplier);
            break;
    }
}

function fillingState(supplier: Supplier) {
    const creepMemory = supplier.memory;
    let container = getById(creepMemory.fillStructure);

    if (container) {
        if (container.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
            const newContainer = findNewStructure(supplier);
            if (!newContainer) {
                creepMemory.fillStructure = null;
                return;
            }
            container = newContainer;
            creepMemory.fillStructure = newContainer.id;
        }
        if (supplier.pos.isNearTo(container)) {
            supplier.transfer(container, RESOURCE_ENERGY);
        } else {
            supplier.travelTo(container);
        }
    }
    else {
        if (Game.time % 3 !== 0) return;
        const container = findNewStructure(supplier);
        if (container) {
            creepMemory.fillStructure = container.id;
        } else supplier.wander();
    }

    if (supplier.energyAmount() === 0) {
        creepMemory.fillStructure = null;
        creepMemory.state = "getting";
    }
}

function gettingState(supplier: Supplier) {
    const creepMemory = supplier.memory;
    const storage = supplier.room.storage;
    if (!storage) {
        if (Game.time % 3 === 0) supplier.wander();
        return;
    }

    if (supplier.pos.isNearTo(storage)) {
        supplier.withdraw(storage, RESOURCE_ENERGY);
    } else {
        supplier.travelTo(storage);
    }

    if (supplier.energyCapacity() === 0) {
        const container = findNewStructure(supplier);
        creepMemory.fillStructure = container ? container.id : null;
        creepMemory.state = "filling";
    }
}

function findNewStructure(supplier: Supplier): StructureTower | StructureSpawn | StructureExtension | null  {
    const spawns: StructureSpawn[] = supplier.room.find(FIND_MY_SPAWNS, {
        filter: s => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });
    if (spawns.length > 0) {
        return spawns[0];
    }

    const towers: StructureTower[] = supplier.room.find(FIND_MY_STRUCTURES, {
        filter: s => {
            return s.structureType === STRUCTURE_TOWER &&
                   s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        }
    });
    if (towers.length > 0) {
        return towers[0];
    }

    const extensions: StructureExtension[] = supplier.room.find(FIND_MY_STRUCTURES, {
        filter: s => {
            return s.structureType === STRUCTURE_TOWER &&
                   s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        }
    });
    if (extensions.length > 0) {
        return extensions[0];
    }
    return null;
}