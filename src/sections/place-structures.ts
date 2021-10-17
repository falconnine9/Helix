import { STAGES } from 'config';
import { rampartsAroundController, rampartsAroundSpawn } from 'placements/ramparts';
import { roadsSpawnToController, roadsSpawnToSources, roadsAroundSpawn } from 'placements/roads';
import { placeStorage } from 'placements/storage';

const placementFunctions: {[placement: string]: CallableFunction} = {
    "rampartsAroundController": rampartsAroundController,
    "rampartsAroundSpawn": rampartsAroundSpawn,
    "roadAroundSpawns": roadsAroundSpawn,
    "roadSpawnToController": roadsSpawnToController,
    "roadSpawnToSources": roadsSpawnToSources,
    "storage": placeStorage
};

export function placeStructuresByStage(): number {
    if (Game.time % 30 !== 0) return 0;
    const cpuPrior = Game.cpu.getUsed();

    for (const room of Object.values(Game.rooms)) {
        handleRoom(room);
    }

    return Game.cpu.getUsed() - cpuPrior;
}

function handleRoom(room: Room): void {
    let doNextStage = true;
    for (const stage of STAGES) {
        if (stage.rcl && room.controller) {
            if (room.controller.level < stage.rcl) break;
        }
        if (!doNextStage) break;
        if (!stage.structures) continue;
        for (const structure of stage.structures) {
            if (!(structure in placementFunctions)) continue;
            const hasBeenPlaced = placementFunctions[structure](room);
            if (hasBeenPlaced) {
                doNextStage = false;
                break;
            }
        }
    }
}