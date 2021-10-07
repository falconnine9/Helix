const allConfig = require("config").config;
const determineCreepNumbers = require("global-actions.core").determineCreepNumbers;
const clearUnusedMemory = require("global-actions.memory").clearUnusedMemory;


const jobs = [
    require("structures.spawn").allActions,
	require("structures.tower").allActions,
    require("jobs.builder").allActions,
    require("jobs.conqueror").allActions,
    require("jobs.defender").allActions,
    require("jobs.filler").allActions,
    require("jobs.harvester").allActions,
    require("jobs.hauler").allActions,
    require("jobs.scout").allActions,
    require("jobs.soldier").allActions,
    require("jobs.upgrader").allActions,
];

if (!Memory.creepIndex) {
    Memory.creepIndex = 0;
}
if (!Memory.scoutInfo) {
    Memory.scoutInfo = {};
}
for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    if (room.name in allConfig) {
        room.memory.config = allConfig[room.name];
    } else {
        room.memory.config = allConfig.global;
    }
}
require("declaration").injectMethods();


module.exports.loop = () => {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        for (const jobFunction of jobs) {
            jobFunction(room);
        }
    }

    determineCreepNumbers();
    clearUnusedMemory();
}