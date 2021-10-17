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

const roleInformation: {[role: string]: [CreepMemory, Body[]]} = {
    builder: [builderMemory, builderBodies],
    defender: [defenderMemory, defenderBodies],
    harvester: [harvesterMemory, harvesterBodies],
    hauler: [haulerMemory, haulerBodies],
    scout: [scoutMemory, scoutBodies],
    supplier: [supplierMemory, supplierBodies],
    upgrader: [upgraderMemory, upgraderBodies]
};

export function spawnActions(spawn: Spawn): void {
    if (spawn.spawning) return;
    if (Game.time % 5 === 0) return;

    let spawnEnergy = spawn.store.getUsedCapacity(RESOURCE_ENERGY);
    const extensions: StructureExtension[] = spawn.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION
    })
    for (const extension of extensions) {
        spawnEnergy += extension.store.getUsedCapacity(RESOURCE_ENERGY);
    }

    let willSpawnCreep = false;
    for (const stage of STAGES) {
        if (stage.rcl && spawn.room.controller) {
            if (spawn.room.controller.level < stage.rcl) break;
        }
        if (willSpawnCreep) break;
        if (stage.roles) {
            for (const role in stage.roles) {
                const creepAmount = stage.roles[role];
                if (spawn.room.getCreepsOfRole(role) >= creepAmount) continue;
                const body = getBodyByEnergy(roleInformation[role][1], spawnEnergy);
                if (body) {
                    const memory = roleInformation[role][0];
                    const creepName = `${role}-${Memory.creepIndex}`;
                    spawn.spawnCreep(body, creepName, {memory: memory});
                    Memory.creeps[creepName].origin = spawn.room.name;
                    Memory.creepIndex++;
                    return;
                }
                else {
                    willSpawnCreep = true;
                    spawn.memory.needsEnergy = true;
                    break;
                }
            }
        }
        if (stage.cores && !willSpawnCreep) {
            if (stage.cores.includes("builderCore")) {
                const status = handleBuilderCore(spawn, spawnEnergy);
                if (status) return;
            }
        }
    }

    if (!willSpawnCreep && spawn.memory.needsEnergy) {
        spawn.memory.needsEnergy = false;
    }
}

function handleBuilderCore(spawn: Spawn, spawnEnergy: number): boolean {
    const allSiteProgress = _.sum(_.map(
        spawn.room.find(FIND_CONSTRUCTION_SITES),
        s => s.progressTotal - s.progress
    ));
    if (allSiteProgress > 0) {
        const amountOfBuilders = Math.ceil(allSiteProgress / 4000);
        if (spawn.room.getCreepsOfRole("builder") >= amountOfBuilders) return false;
        const body = getBodyByEnergy(builderBodies, spawnEnergy);
        if (body) {
            const creepName = `builder-${Memory.creepIndex}`;
            spawn.spawnCreep(body, creepName, {memory: builderMemory});
            Memory.creeps[creepName].origin = spawn.room.name;
            Memory.creepIndex++;
        }
        else {
            spawn.memory.needsEnergy = true;
        }
        return true;
    }

    else {
        const wallHitsLimit = spawn.room.memory.wallHitsLimit;
        const allStructProgress = _.sum(_.map(
            spawn.room.find(FIND_STRUCTURES, {
                filter: s => {
                    if (s.isWall()) {
                        return s.hits < wallHitsLimit;
                    } else if (s.structureType === STRUCTURE_ROAD) {
                        return s.hits < Math.round(s.hitsMax / 2);
                    } else {
                        return s.hits < s.hitsMax;
                    }
                }
            }),
            s2 => s2.hitsMax - s2.hits
        ));
        if (allStructProgress > 0) {
            const amountOfBuilders = Math.ceil(allSiteProgress / 4000);
            if (spawn.room.getCreepsOfRole("builder") >= amountOfBuilders) return false;
            const body = getBodyByEnergy(builderBodies, spawnEnergy);
            if (body) {
                const creepName = `builder-${Memory.creepIndex}`;
                spawn.spawnCreep(body, creepName, {memory: builderMemory});
                Memory.creeps[creepName].origin = spawn.room.name;
                Memory.creepIndex++;
            }
            else {
                spawn.memory.needsEnergy = true;
            }
            return true;
        }

        if (spawn.memory.needsEnergy) {
            spawn.memory.needsEnergy = false;
        }
        return false;
    }
}

function getBodyByEnergy(bodies: Body[], energy: number): Body | null {
    let greatestBody;
    for (const body of bodies) {
        const bodyCost = _.sum(_.map(body, b => BODYPART_COST[b]));
        if (energy >= bodyCost) {
            greatestBody = body;
        }
    }
    if (greatestBody) {
        return greatestBody;
    } else return null;
}