/* The configuration file for the entire bot
 * 
 * You can setup configuration for a certain room by putting
 * a new entry with the key as the room name. If there's no
 * entry for the room it'll work off the global entry
 * 
 *   Variables
 * owner - Your username
 * signText - The text to sign room controllers with
 * wallLimit - The limit to repair walls and ramparts to
 * maxCreeps - The maximum amount of creeps allowed to
 *   be owned by the room
 * creepParts - The parts that each creep should have
 * creepMemory - Default memory entries for creeps on spawn
 */

module.exports.config = {
    global: {
        owner: "OwnerName",
        signText: "example",
        wallLimit: 7000,
        maxCreeps: {
            builder: 0,
            conqueror: 0,
            defender: 1,
            filler: 2,
            harvester: 3,
            hauler: 4,
            upgrader: 4
        },
        creepParts: {
            builder: [CARRY, MOVE, WORK],
            conqueror: [CLAIM, MOVE],
            defender: [ATTACK, ATTACK, MOVE, MOVE],
            filler: [CARRY, MOVE],
            harvester: [MOVE, WORK, WORK],
            hauler: [CARRY, CARRY, CARRY, MOVE, MOVE],
            upgrader: [CARRY, CARRY, MOVE, MOVE, WORK]
        },
        creepMemory: {
            builder: {role: "builder"},
            conqueror: {role: "conqueror"},
            defender: {role: "defender", patrolLocation: null},
            filler: {role: "filler"},
            harvester: {role: "harvester"},
            hauler: {role: "hauler"},
            upgrader: {role: "upgrader"}
        }
    }
}