const hostileParts = [ATTACK, RANGED_ATTACK, HEAL, CLAIM];


module.exports.behaviour = creep => {
    if (creep.room.name !== creep.memory.origin) {
        creep.returnToOrigin();
    }

    switch (creep.memory.state) {
        case "patrolling":
            patrollingState(creep);
            break;
        
        case "defending":
            defendingState(creep);
            break;
    }
}


function patrollingState(creep) {
    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS, {
        filter: c => !Memory.allies.includes(c.owner.username)
    });
    if (hostiles.length === 0) {
        creep.wander();
    }
    else {
        hostiles.sort((a, b) => {
            let aIsHostile = false;
            let bIsHostile = false;
            
            for (const bodyPart of a.body) {
                if (hostileParts.includes(bodyPart.type)) {
                    aIsHostile = true;
                    break;
                }
            }
            for (const bodyPart of b.body) {
                if (hostileParts.includes(bodyPart.type)) {
                    bIsHostile = true;
                    break;
                }
            }

            if (aIsHostile && bIsHostile) {
                if (a.hitsMax - a.hits > b.hitsMax - b.hits) {
                    return -1;
                } else return 1;
            }
            if (aIsHostile && !bIsHostile) return -1;
            if (!aIsHostile && bIsHostile) return 1;
        });
        creep.memory.state = "defending";
        creep.memory.hostile = hostiles[0].id;
    }
}


function defendingState(creep) {
    const hostile = Game.getObjectById(creep.memory.hostile);
    if (!hostile) {
        creep.memory.state = "patrolling";
        return;
    }

    const status = creep.attack(hostile);
    if (status === ERR_NOT_IN_RANGE) {
        let hasRanged = false;
        for (const bodyPart of creep.body) {
            if (bodyPart.type === RANGED_ATTACK) {
                hasRanged = true;
                break;
            }
        }
        if (hasRanged) {
            const status = creep.rangedAttack(hostile);
            if (status === ERR_NOT_IN_RANGE) {
                creep.moveToInRoom(hostile.pos);
            }
        }
        else {
            creep.moveToInRoom(hostile.pos);
        }
    }
}