const jobs = [
    require("structures.spawn").allActions,
    require("jobs.builder").allActions,
    require("jobs.defender").allActions,
    require("jobs.filler").allActions,
    require("jobs.harvester").allActions,
    require("jobs.hauler").allActions,
    require("jobs.upgrader").allActions,
];

if (!Memory.creepIndex) {
    Memory.creepIndex = 0;
}


module.exports.loop = () => {
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        for (const jobFunction of jobs) {
            jobFunction(room);
        }
    }

    require("global-actions.memory").clearUnusedMemory();
}