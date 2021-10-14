import { builderMemory, builderActions } from './builder';
import { harvesterMemory, harvesterActions } from './harvester';
import { haulerMemory, haulerActions } from './hauler';
import { scoutMemory, scoutActions } from './scout';
import { supplierMemory, supplierActions } from './supplier';
import { upgraderMemory, upgraderActions } from './upgrader';

interface Role {
    name: string;
    memory: CreepMemory;
    behaviour: CallableFunction;
}

export const CREEP_ROLES: {[role: string]: Role} = {
    builder: {name: "builder", memory: builderMemory, behaviour: builderActions},
    harvester: {name: "harvester", memory: harvesterMemory, behaviour: harvesterActions},
    hauler: {name: "hauler", memory: haulerMemory, behaviour: haulerActions},
    scout: {name: "scout", memory: scoutMemory, behaviour: scoutActions},
    supplier: {name: "supplier", memory: supplierMemory, behaviour: supplierActions},
    upgrader: {name: "upgrader", memory: upgraderMemory, behaviour: upgraderActions}
};