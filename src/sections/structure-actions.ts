import { spawnActions } from 'structures/spawn';
import { towerActions } from 'structures/tower';

export function allStructureActions(): number {
    if (Game.time % 60 === 0) updateStructureList();
    const cpuPrior = Game.cpu.getUsed();

    for (const structure of Memory.towerList) {
        const tower = getById(structure);
        if (!tower) {
            const index = Memory.towerList.indexOf(structure);
            Memory.towerList.splice(index);
            continue;
        }
        towerActions(tower as Tower);
    }

    for (const spawn of Object.values(Game.spawns)) {
        spawnActions(spawn as Spawn);
    }

    return Game.cpu.getUsed() - cpuPrior;
}

function updateStructureList(): void {
    for (const room of Object.values(Game.rooms)) {
        const roomTowers: StructureTower[] = room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER
        });
        for (const tower of roomTowers) {
            if (!Memory.towerList.includes(tower.id)) {
                Memory.towerList.push(tower.id);
            }
        }
    }
}