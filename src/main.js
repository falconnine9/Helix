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
    for (const roomName of Game.rooms) {
        const room = Game.rooms[roomName];
        for (const jobFunction of jobs) {
            jobFunction(room);
        }
    }

    clearUnusedMemory();
}