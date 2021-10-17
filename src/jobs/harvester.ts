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

export const harvesterBodies: Body[] = [
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
    if (harvester.ticksToLive && harvester.ticksToLive < 5) {
        if (creepMemory.source) {
            Game.flags[`source-${creepMemory.source}`].memory.harvester = null;
        }
        return;
    }

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
        const availableSourceFlags = _.filter(
            Game.flags,
            flag => flag.name.startsWith("source") && !flag.memory.harvester
        );
        if (availableSourceFlags.length > 0) {
            const sourcesAtFlag = harvester.room.lookForAt(
                LOOK_SOURCES,
                availableSourceFlags[0]
            );
            if (sourcesAtFlag.length === 0) return;
            availableSourceFlags[0].memory.harvester = harvester.id;
            creepMemory.source = sourcesAtFlag[0].id;
        }
    }
}