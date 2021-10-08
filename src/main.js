const injectMethods = require("declaration").injectMethods;
const doAllJobs = require("jobs.all-jobs").doAllJobs;
const memoryActions = require("global-actions.memory");

injectMethods();
if (!Memory.creepIndex) {
    Memory.creepIndex = 0;
}
if (!Memory.scoutInfo) {
    Memory.scoutInfo = {};
}
if (!Memory.allies) {
    Memory.allies = [];
}


module.exports.loop = () => {
    doAllJobs();
    memoryActions.deleteExpiredCreeps();
}