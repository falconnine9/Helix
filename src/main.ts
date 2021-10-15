/* FalconAI: Screeps bot
 * -------------
 * Accessing and copying permissions can be found in
 * the 'LICENSE' file.
 * -------------
 * A guide (if you want to use it) can be found in
 * the 'README.md' file.
 */

import { injectMethods } from 'declaration';
import { allCreepJobs } from 'sections/creep-jobs';
import { allStructureActions } from 'sections/structure-actions';

if (!Memory.creepIndex) {
    Memory.creepIndex = 0;
}
if (!Memory.allies) {
    Memory.allies = [];
}
if (!Memory.scoutInfo) {
    Memory.scoutInfo = {};
}
if (!Memory.towerList) {
    Memory.towerList = [];
}
injectMethods();

export const loop = (): void => {
    const structureUsed = allStructureActions();
    const creepUsed = allCreepJobs();
    if (Game.time % 5 === 0) deleteExpiredCreeps();
}

function deleteExpiredCreeps() {
    for (const creepEntry in Memory.creeps) {
        if (!(creepEntry in Game.creeps)) {
            delete Memory.creeps[creepEntry];
        }
    }
}