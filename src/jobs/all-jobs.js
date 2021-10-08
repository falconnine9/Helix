const defenderBehaviour = require("jobs.defender").behaviour;
const haulerBehaviour = require("jobs.hauler").behaviour;
const harvesterBehaviour = require("jobs.harvester").behaviour;
const supplierBehaviour = require("jobs.supplier").behaviour;
const upgraderBehaviour = require("jobs.upgrader").behaviour;


module.exports.doAllJobs = () => {
    for (const creep of Object.values(Game.creeps)) {
        switch (creep.memory.role) {
            case "defender":
                defenderBehaviour(creep);
                break;

            case "hauler":
                haulerBehaviour(creep);
                break;

            case "harvester":
                harvesterBehaviour(creep);
                break;
            
            case "supplier":
                supplierBehaviour(creep);
            
            case "upgrader":
                upgraderBehaviour(creep);
                break;
        }
    }
}