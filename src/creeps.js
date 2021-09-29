export const maxCreeps = {
    builder: 2,
    defender: 6,
    harvester: 3,
    hauler: 3,
    upgrader: 2
};
export const creepParts = {
    builder: [CARRY, MOVE, WORK],
    defender: [ATTACK, ATTACK, MOVE, MOVE],
    harvester: [MOVE, WORK, WORK],
    hauler: [CARRY, CARRY, CARRY, MOVE, MOVE],
    upgrader: [CARRY, MOVE]
};
export const creepEnergy = {
    builder: 200,
    defender: 260,
    harvester: 250,
    hauler: 250,
    upgrader: 100
};
export const creepMemory = {
    builder: {role: "builder"},
    defender: {role: "defender", patrolLocation: null},
    harvester: {role: "harvester"},
    hauler: {role: "hauler"},
    upgrader: {role: "upgrader"}
};