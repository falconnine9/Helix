declare global {
    interface Harvester extends Creep {
        memory: HarvesterMemory;
    }

    interface HarvesterMemory extends CreepMemory {
        role: "harvester";
        source: Id<Source> | null;
        state: "harvesting";
    }
}

export const harvesterMemory: HarvesterMemory = {
    role: "harvester",
    source: null,
    state: "harvesting"
};

export const harvesterBodies: BodyPartConstant[][] = [
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE],
    [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
    [WORK, WORK, WORK, MOVE, MOVE],
    [WORK, WORK, MOVE]
];

export function harvesterActions(creep: Creep): void {
    const harvester = creep as Harvester;
    switch (harvester.memory.state) {
        case "harvesting":
            harvestingState(harvester);
            break;
    }
}

function harvestingState(harvester: Harvester): void {
    const creepMemory = harvester.memory;
    const sourcePoint = getById(creepMemory.source);

    if (sourcePoint) {
        if (sourcePoint.energy === 0) {
            creepMemory.source = null;
            return;
        }
        if (harvester.pos.isNearTo(sourcePoint)) {
            harvester.harvest(sourcePoint);
        } else {
            harvester.travelTo(sourcePoint);
        }
    }
    else {
        if (Game.time % 3 !== 0) return;
        const availableSources = harvester.room.find(FIND_SOURCES)
            .filter(s => s.energy > 0)
            .sort((a, b) => a.energy - b.energy);

        if (availableSources.length > 0) {
            creepMemory.source = availableSources[0].id;
        }
        else harvester.wander();
    }
}