import { listCreepsOfRole } from '../util';


export function allHarvesterActions(room) {
    for (const creep of listCreepsOfRole(room, "harvester")) {
        doActions(creep);
    }
}


function doActions(creep) {
    const source = creep.pos.findClosestByRange(FIND_SOURCES);
    if (!source) return;

    const status = creep.harvest(source);
    if (status === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
    }
}