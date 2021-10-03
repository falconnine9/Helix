const allConfig = require("config").config;


module.exports.allActions = (room) => {
    for (const tower of room.find(FIND_MY_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER
    })) {
        doActions(tower);
    }
}


function doActions(tower) {
    const hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        tower.attack(hostile);
    }

    else {
        const friendly = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: c => c.hits < c.hitsMax
        });
        if (friendly) {
            tower.heal(friendly);
        }

        else {
            let config;
            if (tower.room.name in allConfig) {
                config = allConfig[tower.room.name];
            } else {
                config = allConfig["global"];
            }

            const structs = tower.room.find(FIND_STRUCTURES, {
                filter: s => {
                    if (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART) {
                        return s.hits < config.wallLimit;
                    } else {
                        return s.hits < Math.round(s.hitsMax / 1.5);
                    }
                }
            });
            if (structs.length === 0) return;
            structs.sort((a, b) => (a.hitsMax - a.hits) - (b.hitsMax - b.hits));
            structs.reverse();

            tower.repair(structs[0]);
        }
    }
}