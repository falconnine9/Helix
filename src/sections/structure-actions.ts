import { spawnActions } from 'structures/spawn';
import { towerActions } from 'structures/tower';

export function allStructureActions(): number {
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