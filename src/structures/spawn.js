import { maxCreeps, creepParts, creepEnergy, creepMemory } from '../creeps';
import { getCreepsOfRole, listSpawnsInRoom } from '../util';


export function allSpawnActions(room) {
    for (const spawn of listSpawnsInRoom(room)) {
        doActions(spawn);
    }
}


function doActions(spawn) {
    for (const role in maxCreeps) {
        if (getCreepsOfRole(spawn.room.name, role) < maxCreeps[role]) {
            if (spawn.energy >= creepEnergy[role]) {
                spawn.spawnCreep(creepParts[role], `${role}-${Memory.creepIndex}`);
                Game.creeps[`${role}-${Memory.creepIndex}`] = creepMemory[role];
                Memory.creepIndex += 1;
                return;
            }
        }
    }
}