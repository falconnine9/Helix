import { allBuilderActions } from 'jobs/builder';
import { allDefenderActions } from 'jobs/defender';
import { allHarvesterActions } from 'jobs/harvester';
import { allHaulerActions } from 'jobs/hauler';

import { allSpawnActions } from 'structures/spawn';

import { clearUnusedMemory } from 'global-actions/memory';

const jobs = [
    allBuilderActions,
    allDefenderActions,
    allHarvesterActions,
    allHaulerActions,
    allSpawnActions
];

if (!Memory.creepIndex) {
    Memory.creepIndex = 0;
}


export function loop() {
    let rooms = [];
    for (const spawn in Game.spawns) {
        if (!rooms.includes(Game.spawns[spawn].room.name)) {
            rooms.push(Game.spawns[spawn].room.name);
        }
    }

    for (const room of rooms) {
        for (const jobFunction of jobs) {
            jobFunction(room);
        }
    }

    clearUnusedMemory();
}