const allConfig = require("config").config;
const utils = require("utils");


module.exports.allActions = (room) => {
    for (const spawn of room.find(FIND_MY_SPAWNS)) {
        doActions(spawn);
    }
}


function doActions(spawn) {
    let willSpawn = false;
    let config;
    if (spawn.room.name in allConfig) {
        config = allConfig[spawn.room.name];
    } else {
        config = allConfig["global"];
    }

    for (const role in config.maxCreeps) {
        if (utils.getCreepsOfRole(spawn.room.name, role) < config.maxCreeps[role]) {
            const status = spawn.spawnCreep(config.creepParts[role], `${role}-${Memory.creepIndex}`, {
                memory: config.creepMemory[role]
            });
            if (status === OK) {
                Game.creeps[`${role}-${Memory.creepIndex}`].memory.origin = spawn.room.name;
                Memory.creepIndex += 1;
                return;
            } else if (status === ERR_NOT_ENOUGH_ENERGY) {
                willSpawn = true;
                spawn.memory.needsEnergy = true;
            }
        }
    }

    if (!willSpawn) {
        spawn.memory.needsEnergy = false;
    }
}