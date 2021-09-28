import { OWNER } from 'globals';
import { maxCreeps, creepParts, creepEnergy, creepMemory } from 'creeps';
import { getCreepsOfRole } from 'util';


export function allSpawnActions() {
    for (const spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName];
        if (spawn.owner === OWNER) {
            doActions(spawn);
        }
    }
}


function doActions(spawn) {
    for (const role in maxCreeps) {
        if (getCreepsOfRole(spawn.room.name, role) < maxCreeps[role]) {
            spawn.memory.needsEnergy = true;
            if (spawn.energy >= creepEnergy[role]) {
                spawn.spawnCreep(creepParts[role], `role-${Memory.creepIndex}`);
                Memory.creepIndex += 1;
                return;
            }
        }
    }
}