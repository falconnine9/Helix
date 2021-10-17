/* FalconAI: Screeps bot
 * -------------
 * Accessing and copying permissions can be found in
 * the 'LICENSE' file.
 * -------------
 * A guide (if you want to use it) can be found in
 * the 'README.md' file.
 */

import { SHOW_USED_CPU_IN_CONSOLE } from 'config';
import { injectMethods } from 'declaration';
import { allCreepJobs } from 'sections/creep-jobs';
import { allStructureActions } from 'sections/structure-actions';
import { placeStructuresByStage } from 'sections/place-structures';

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
    if (Game.time % 60 === 0) deleteExpiredCreeps();
    if (Game.time % 120 === 0) updateStructureList();

    const structureUsed = allStructureActions();
    const creepUsed = allCreepJobs();
    const placementUsed = placeStructuresByStage();

    if (SHOW_USED_CPU_IN_CONSOLE && Game.time % 60 === 0) {
        console.log(
            "CPU usage statisics\n" +
            `Structures used: ${Math.round(structureUsed)} CPU\n` +
            `Creeps used: ${Math.round(creepUsed)} CPU \n` +
            `Placements used: ${Math.round(placementUsed)} CPU`
        );
    }
}

function updateStructureList() {
    for (const room of Object.values(Game.rooms)) {
        // Updating tower list
        const towers: StructureTower[] = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        for (const tower of towers) {
            if (Memory.towerList.includes(tower.id)) continue;
            Memory.towerList.push(tower.id);
        }

        // Placing source flags
        const sources: Source[] = room.find(FIND_SOURCES);
        const flagList = _.map(_.filter(
            Game.flags,
            flag => flag.name.startsWith("source")
        ), f => f.name);
        for (const source of sources) {
            if (flagList.includes(`source-${source.id}`)) continue;
            room.createFlag(source.pos, `source-${source.id}`);
        }
    }
}

function deleteExpiredCreeps() {
    for (const creepEntry in Memory.creeps) {
        if (!(creepEntry in Game.creeps)) {
            delete Memory.creeps[creepEntry];
        }
    }
}