/* The configuration file for the entire bot
 * 
 * You can setup configuration for a certain room by putting
 * a new entry with the key as the room name. If there's no
 * entry for the room it'll work off the global entry
 * 
 *   Variables
 * wallLimit - The limit to repair walls and ramparts to
 * maxCreeps - The maximum amount of creeps allowed to
 *   be owned by the room
 * creepParts - The parts that each creep should have
 * creepMemory - Default memory entries for creeps on spawn
 */

module.exports.config = {
    global: {
        wallLimit: 7000,
        maxCreeps: {
            builder: 2,
            defender: 2,
            filler: 1,
            harvester: 3,
            hauler: 4,
            upgrader: 4
        },
        creepParts: {
            builder: [CARRY, MOVE, WORK],
            defender: [ATTACK, ATTACK, MOVE, MOVE],
            filler: [CARRY, MOVE],
            harvester: [MOVE, WORK, WORK],
            hauler: [CARRY, CARRY, CARRY, MOVE, MOVE],
            upgrader: [CARRY, CARRY, MOVE, MOVE, WORK]
        },
        creepMemory: {
            builder: {role: "builder", repairStruct: null},
            defender: {role: "defender", patrolLocation: null},
            filler: {role: "filler"},
            harvester: {role: "harvester"},
            hauler: {role: "hauler"},
            upgrader: {role: "upgrader"}
        }
    }
}