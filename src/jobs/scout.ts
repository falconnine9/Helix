declare global {
    interface Scout extends Creep {
        memory: ScoutMemory;
    }

    interface ScoutMemory extends CreepMemory {
        role: "scout";
        exit: ExitConstant | null;
        exitPosition: RoomPosition | null;
        previousRoom: string | null;
        previousTickRoom: string | null;
        state: "scouting";
    }

    interface ScoutEntry {
        room: string;
        tick: number;
        sources: number;
        hostiles: {[player: string]: number};
        hostileStructures: {[player: string]: number};
        swampRatio: number;
        wallRatio: number;
    }
}

export const scoutMemory: ScoutMemory = {
    role: "scout",
    exit: null,
    exitPosition: null,
    previousRoom: null,
    previousTickRoom: null,
    state: "scouting"
};

export const scoutBodies: BodyPartConstant[][] = [
    [MOVE]
];

export function scoutActions(creep: Creep): void {
    const scout = creep as Scout;
    switch (scout.memory.state) {
        case "scouting":
            scoutingState(scout);
            break;
    }
}

function scoutingState(scout: Scout): void {
    const creepMemory = scout.memory;

    if (scout.room.name !== creepMemory.previousTickRoom) {
        creepMemory.previousRoom = creepMemory.previousTickRoom;
        creepMemory.exit = getNewExit(scout);
        writeScoutData(scout.room);
    }
    else {
        if (!creepMemory.exitPosition) {
            if (creepMemory.exit) {
                creepMemory.exitPosition = scout.pos.findClosestByRange(
                    creepMemory.exit
                );
            } else {
                creepMemory.exit = getNewExit(scout);
                creepMemory.exitPosition = scout.pos.findClosestByRange(
                    creepMemory.exit as FindConstant
                );
            }
        }
        scout.travelTo(new RoomPosition(
            creepMemory.exitPosition ? creepMemory.exitPosition.x : 0,
            creepMemory.exitPosition ? creepMemory.exitPosition.y : 0,
            creepMemory.exitPosition ? creepMemory.exitPosition.roomName : ""
        ));
    }
    creepMemory.previousTickRoom = scout.room.name;
}

function writeScoutData(room: Room): void {
    const hostileGroups = _.groupBy(
        room.find(FIND_HOSTILE_CREEPS),
        c => c.owner.username
    );
    const hostileNumbers: {[player: string]: number} = {};
    for (const group in hostileGroups) {
        hostileNumbers[group] = hostileGroups[group].length;
    }

    const hostileStructGroups = _.groupBy(
        room.find(FIND_HOSTILE_STRUCTURES),
        s => s.owner ? s.owner.username : "unowned"
    );
    const hostileStructNumbers: {[player: string]: number} = {};
    for (const group in hostileStructGroups) {
        hostileStructNumbers[group] = hostileStructGroups[group].length;
    }

    const ratios = room.getTileRatio();
    Memory.scoutInfo[room.name] = {
        room: room.name,
        tick: Game.time,
        sources: room.find(FIND_SOURCES).length,
        hostiles: hostileNumbers,
        hostileStructures: hostileStructNumbers,
        swampRatio: ratios.swamp,
        wallRatio: ratios.wall
    };
}

function getNewExit(scout: Scout): ExitConstant | null {
    const allExits = Object.values(Game.map.describeExits(scout.room.name))
        .filter(room => room !== scout.memory.previousRoom)
        .sort((a, b) => {
            if (a in Memory.scoutInfo && !(b in Memory.scoutInfo)) {
                return 1;
            } else if (!(a in Memory.scoutInfo) && b in Memory.scoutInfo) {
                return -1;
            } else return 0;
        });
    const exit = Game.map.findExit(scout.room.name, allExits[0]);
    if (exit !== -2 && exit !== -10) {
        return exit;
    } else return null;
}