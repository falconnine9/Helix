const utils = require("utils");
const oppositeDirections = {
    FIND_EXIT_TOP: FIND_EXIT_BOTTOM,
    FIND_EXIT_BOTTOM: FIND_EXIT_TOP,
    FIND_EXIT_LEFT: FIND_EXIT_RIGHT,
    FIND_EXIT_RIGHT: FIND_EXIT_LEFT
};


module.exports.allActions = (room) => {
    for (const creep of utils.listCreepsOfRole(room.name, "scout")) {
        doActions(creep);
    }
}


function doActions(creep) {
    if (!creep.memory.previousTickRoom) {
        creep.memory.previousTickRoom = creep.room.name;
    }

    if (creep.room.name === creep.memory.previousTickRoom) {
        if (!creep.memory.exit) {
            const exits = findNewExits(creep);
            if (exits[1]) {
                creep.memory.exit = exits[0][Math.floor(Math.random() * exits.length)];
            } else {
                creep.memory.exit = exits[0][0];
            }
        }
        creep.moveTo(creep.pos.findClosestByRange(creep.memory.exit));
    }

    else {
        doScouting(creep, creep.room);
        creep.memory.previousExit = oppositeDirections[creep.memory.exit];

        const exits = findNewExits(creep);
        if (exits[0].length < 0) {
            creep.memory.exit = creep.memory.previousExit;
        }
        else {
            if (exits[1]) {
                creep.memory.exit = exits[0][Math.floor(Math.random() * exits.length)];
            } else {
                creep.memory.exit = exits[0][0];
            }
        }
        creep.moveTo(creep.pos.findClosestByRange(creep.memory.exit));
    }
    
    creep.memory.previousTickRoom = creep.room.name;
}


function findNewExits(creep) {
    const exitRooms = Game.map.describeExits(creep.room.name);
    let exitNames = [];
    for (const exitName in exitRooms) {
        exitNames.push(parseInt(exitName));
    }

    const exits = [
        FIND_EXIT_TOP,
        FIND_EXIT_BOTTOM,
        FIND_EXIT_LEFT,
        FIND_EXIT_RIGHT
    ].filter(exit => {
        if (exit === creep.memory.previousExit) {
            return false;
        } else if (!exitNames.includes(exit)) {
            return false;
        } else return true;
    });

    let doRandom = true;
    exits.sort((a, b) => {
        if (exitRooms[a.toString()] in Memory.scoutInfo && exitRooms[b.toString()] in Memory.scoutInfo) {
            return 0;
        } else if (exitRooms[a.toString()] in Memory.scoutInfo && !(exitRooms[b.toString()] in Memory.scoutInfo)) {
            if (doRandom) doRandom = false;
            return -1;
        } else {
            if (doRandom) doRandom = false;
            return 1;
        }
    });
    return [exits, doRandom];
}


function doScouting(creep, room) {
    let owner = null;
    let controllerLevel = null;
    if (room.controller) {
        owner = room.controller.owner;
        controllerLevel = room.controller.level;
    }

    const terrain = Game.map.getRoomTerrain(room.name);
    let swampTiles = 0;
    let wallTiles = 0;
    for (let x = 0; x < 50; x++) {
        for (let y = 0; y < 50; y++) {
            const tile = terrain.get(x, y);
            if (tile === TERRAIN_MASK_SWAMP) {
                swampTiles++;
            } else if (tile === TERRAIN_MASK_WALL) {
                wallTiles++;
            }
        }
    }

    let hostiles = {};
    const hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
    for (const hostile of hostileCreeps) {
        if (hostile.owner in hostiles) {
            hostiles[hostile.owner] += 1;
        }
        else {
            hostiles[hostile.owner] = 1;
        }
    }

    Memory.scoutInfo[room.name] = {
        owner: owner,
        controllerLevel: controllerLevel,
        swampPercent: swampTiles / (50 * 50),
        wallPercent: wallTiles / (50 * 50),
        lenSources: creep.room.find(FIND_SOURCES).length,
        hostiles: hostiles
    };
}