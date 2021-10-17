import { CPU_PRIORITY } from 'config';
import { CREEP_ROLES } from 'jobs/roles';

const sacraficeImmune = ["defender", "soldier"];

export function allCreepJobs(): number {
    const cpuPrior = Game.cpu.getUsed();
    const healthyCreeps = Object.values(Game.creeps).filter(creep => {
        if (creep.spawning) return false;
        if (creep.hits <= creep.hitsMax / 2) {
            if (sacraficeImmune.includes(creep.memory.role)) return true;
            creep.say("Sacrafice");
            creep.suicide();
            return false;
        } else return true;
    });

    const groupedByRole = _.sortBy(
        _.groupBy(healthyCreeps, c => c.memory.role),
        (x, role) => CPU_PRIORITY[role ?? "none"]
    );
    for (const role of groupedByRole) {
        for (const creep of role) {
            CREEP_ROLES[creep.memory.role].behaviour(creep);
        }
    }

    return Game.cpu.getUsed() - cpuPrior;
}