import { STAGES } from 'config';
import { builderMemory, builderBodies } from 'jobs/builder';
import { defenderMemory, defenderBodies } from 'jobs/defender';
import { harvesterMemory, harvesterBodies } from 'jobs/harvester';
import { haulerMemory, haulerBodies } from 'jobs/hauler';
import { scoutMemory, scoutBodies } from 'jobs/scout';
import { supplierMemory, supplierBodies } from 'jobs/supplier';
import { upgraderMemory, upgraderBodies } from 'jobs/upgrader';

declare global {
    interface Spawn extends StructureSpawn {
        memory: SpawnMemory;
    }

    interface SpawnMemory {
        needsEnergy: true | false;
    }
}

const roleInformation: {[role: string]: Array<CreepMemory | BodyPartConstant[][]>} = {
    builder: [builderMemory, builderBodies],
    defender: [defenderMemory, defenderBodies],
    harvester: [harvesterMemory, harvesterBodies],
    hauler: [haulerMemory, haulerBodies],
    scout: [scoutMemory, scoutBodies],
    supplier: [supplierMemory, supplierBodies],
    upgrader: [upgraderMemory, upgraderBodies]
}

export function spawnActions(spawn: Spawn) {
    if (spawn.spawning) return;
    if (Game.time % 5 === 0) return;

    let spawnEnergy = spawn.store.getUsedCapacity(RESOURCE_ENERGY);
    const extensions: StructureExtension[] = spawn.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION
    })
    for (const extension of extensions) {
        spawnEnergy += extension.store.getUsedCapacity(RESOURCE_ENERGY);
    }

    let doNextStage = true;
    for (const stage of STAGES) {
        if (stage.rcl && spawn.room.controller) {
            if (spawn.room.controller.level < stage.rcl) break;
        }
        if (!doNextStage) break;
        if (!stage.roles) continue;
        for (const creep in stage.roles) {
            const creepAmount = stage.roles[creep];
            if (spawn.room.getCreepsOfRole(creep) >= creepAmount) continue;

            const body = getBodyByEnergy(
                roleInformation[creep][1] as BodyPartConstant[][],
                spawnEnergy
            );
            const memory = roleInformation[creep][0] as CreepMemory;
            if (body) {
                spawn.spawnCreep(body, `${creep}-${Memory.creepIndex}`, {
                    memory: memory
                });
                Memory.creeps[`${creep}-${Memory.creepIndex}`].origin = spawn.room.name;
                Memory.creepIndex++;
                return;
            } else {
                spawn.memory.needsEnergy = true;
                doNextStage = false;
                continue;
            };
        }
    }

    if (doNextStage) {
        spawn.memory.needsEnergy = false;
    }
}

function getBodyByEnergy(bodies: BodyPartConstant[][], energy: number): BodyPartConstant[] | null {
    for (const body of bodies) {
        let bodyCost = 0;
        for (const part of body) bodyCost += BODYPART_COST[part];
        if (energy >= bodyCost) {
            return body;
        }
    }
    return null;
}