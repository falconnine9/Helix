/* These are the default creep information objects
 *
 * I have my own setup for it, and you should make your own setup
 * for it based on your room controller level
 * 
 *   VARIABLES:
 * maxCreeps is the maximum amount of each role allowed in one room
 * 
 * creepParts is the parts that each creep should get when they
 * are spawned
 * 
 * creepEnergy is the required amount of energy for each creep, it
 * should reflect the cost of each part in creepParts
 * 
 * creepMemory is the memory given to the creep when it's spawned,
 * most of the time this will just be it's role, but it can also
 * be other attributes that you may wanna save between ticks
 */

module.exports.maxCreeps = {
    builder: 2,
    defender: 3,
    harvester: 3,
    hauler: 4,
    upgrader: 4
};
module.exports.creepParts = {
    builder: [CARRY, MOVE, WORK],
    defender: [ATTACK, ATTACK, MOVE, MOVE],
    harvester: [MOVE, WORK, WORK],
    hauler: [CARRY, CARRY, CARRY, MOVE, MOVE],
    upgrader: [CARRY, CARRY, MOVE, MOVE, WORK]
};
module.exports.creepEnergy = {
    builder: 200,
    defender: 260,
    harvester: 250,
    hauler: 250,
    upgrader: 300
};
module.exports.creepMemory = {
    builder: {role: "builder", repairStruct: null},
    defender: {role: "defender", patrolLocation: null},
    harvester: {role: "harvester"},
    hauler: {role: "hauler"},
    upgrader: {role: "upgrader"}
};