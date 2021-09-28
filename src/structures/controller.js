export function controllerActions() {
    deleteOldCreeps();
}


function deleteOldCreeps() {
    for (const creep in Memory.creeps) {
        if (!(creep in Game.creeps)) {
            delete Memory.creeps[creep];
        }
    }
}