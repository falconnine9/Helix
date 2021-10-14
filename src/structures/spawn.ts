import { STAGES } from 'config';
import { builderMemory, builderBodies } from 'jobs/builder';
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

            let body = null;
            let memory = null;
            switch (creep) {
                case "builder":
                    body = getBodyByEnergy(builderBodies, spawnEnergy);
                    memory = builderMemory;
                    break;
                case "harvester":
                    body = getBodyByEnergy(harvesterBodies, spawnEnergy);
                    memory = harvesterMemory;
                    break;
                case "hauler":
                    body = getBodyByEnergy(haulerBodies, spawnEnergy);
                    memory = haulerMemory;
                    break;
                case "scout":
                    body = getBodyByEnergy(scoutBodies, spawnEnergy);
                    memory = scoutMemory;
                    break;
                case "supplier":
                    body = getBodyByEnergy(supplierBodies, spawnEnergy);
                    memory = supplierMemory;
                    break;
                case "upgrader":
                    body = getBodyByEnergy(upgraderBodies, spawnEnergy);
                    memory = upgraderMemory;
                    break;
            }
            if (body) {
                spawn.spawnCreep(body, `${creep}-${Memory.creepIndex}`);
                Memory.creeps[`${creep}-${Memory.creepIndex}`] = memory as CreepMemory;
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