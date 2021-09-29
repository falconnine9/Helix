import { listCreepsOfRole } from '../util';


export function allDefenderActions(room) {
    for (const creep of listCreepsOfRole(room, "defender")) {
        doActions(creep);
    }
}


function doActions(creep) {
    const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        const status = creep.attack(hostile);
        if (status === ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile);
        }
    }
}