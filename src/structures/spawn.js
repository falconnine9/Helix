const creepInfo = require("creeps");
const utils = require("utils");


module.exports.allActions = (room) => {
    for (const spawn of room.find(FIND_MY_SPAWNS)) {
        doActions(spawn);
    }
}


function doActions(spawn) {
    let willSpawn = false;

    for (const role in creepInfo.maxCreeps) {
        if (utils.getCreepsOfRole(spawn.room.name, role) < creepInfo.maxCreeps[role]) {
            if (spawn.energy >= creepInfo.creepEnergy[role]) {
                spawn.spawnCreep(creepInfo.creepParts[role], `${role}-${Memory.creepIndex}`, {
                    memory: creepInfo.creepMemory[role]
                });
                Memory.creepIndex += 1;
                return;
            }
            else {
                willSpawn = true;
                spawn.memory.needsEnergy = true;
            }
        }
    }

    if (!willSpawn) {
        spawn.memory.needsEnergy = false;
    }
}