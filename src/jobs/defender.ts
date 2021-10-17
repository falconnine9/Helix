import { SIGN_TEXT, OWNER } from 'config';

declare global {
    interface Defender extends Creep {
        memory: DefenderMemory;
    }

    interface DefenderMemory extends CreepMemory {
        role: "defender";
        hostile: Id<Creep> | null;
        state: "defending";
    }
}

export const defenderMemory: DefenderMemory = {
    role: "defender",
    hostile: null,
    state: "defending"
};

export const defenderBodies: Body[] = [
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE,
     ATTACK, MOVE, RANGED_ATTACK, MOVE, ATTACK, MOVE, RANGED_ATTACK, MOVE,
     ATTACK, MOVE, RANGED_ATTACK, MOVE, ATTACK, MOVE, RANGED_ATTACK, MOVE],
    [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, MOVE, RANGED_ATTACK,
     MOVE, ATTACK, MOVE, RANGED_ATTACK, MOVE],
    [TOUGH, TOUGH, MOVE, MOVE, ATTACK, MOVE, ATTACK, MOVE],
    [ATTACK, MOVE, ATTACK, MOVE]
];

const hostileParts = [ATTACK, RANGED_ATTACK, HEAL];

export function defenderActions(creep: Creep): void {
    const defender = creep as Defender;
    switch (defender.memory.state) {
        case "defending":
            defendingState(defender);
            break;
    }
}

function defendingState(defender: Defender): void {
    const creepMemory = defender.memory;
    const creepBodyMap = defender.body.map(c => c.type);
    const hostile = getById(creepMemory.hostile);

    if (hostile) {
        if (defender.pos.isNearTo(hostile)) {
            defender.attack(hostile);
            if (creepBodyMap.includes(RANGED_ATTACK)) {
                defender.rangedAttack(hostile);
            }
            return;
        }
        if (creepBodyMap.includes(RANGED_ATTACK)) {
            if (!defender.pos.inRangeTo(hostile, 3)) return;
            defender.rangedAttack(hostile);
            return;
        }
    }

    else {
        if (Game.time % 3 !== 0) return;
        const hostiles = defender.room.find(FIND_HOSTILE_CREEPS, {
            filter: creep => !Memory.allies.includes(creep.owner.username)
        });
        if (hostiles.length > 0) {
            hostiles.sort((a, b) => {
                const aMap = a.body.map(c => c.type);
                const bMap = b.body.map(c => c.type);
                let aIsHostile = false;
                let bIsHostile = false;
                for (const hostilePart of hostileParts) {
                    if (aMap.includes(hostilePart)) aIsHostile = true;
                    if (bMap.includes(hostilePart)) bIsHostile = true;
                }
                if (aIsHostile && !bIsHostile) {
                    return -1;
                } else if (!aIsHostile && bIsHostile) {
                    return 1;
                } else return 0;
            });
            creepMemory.hostile = hostiles[0].id;
            return;
        }

        const controller = defender.room.controller;
        if (!controller) {
            defender.wander();
            return;
        }
        if (!controller.sign
            || controller.sign.text !== SIGN_TEXT
            || controller.sign.username !== OWNER) {
            if (defender.pos.isNearTo(controller.pos)) {
                defender.signController(controller, SIGN_TEXT)
            } else {
                defender.travelTo(controller);
            }
        } else defender.wander();
    }
}