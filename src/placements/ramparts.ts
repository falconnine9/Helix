export function rampartsAroundController(room: Room): boolean {
    if (!room.controller) return false;
    return placeRamparts(room, room.controller.pos);
}

export function rampartsAroundSpawn(room: Room): boolean {
    const spawns = room.find(FIND_MY_SPAWNS);
    let hasConstructionSite = false;
    for (const spawn of spawns) {
        const status = placeRamparts(room, spawn.pos);
        if (status) hasConstructionSite = true;
    }
    return hasConstructionSite;
}

function placeRamparts(room: Room, pos: RoomPosition) {
    const positions = [
        new RoomPosition(pos.x - 1, pos.y - 1, pos.roomName),
        new RoomPosition(pos.x - 1, pos.y, pos.roomName),
        new RoomPosition(pos.x - 1, pos.y + 1, pos.roomName),
        new RoomPosition(pos.x, pos.y - 1, pos.roomName),
        new RoomPosition(pos.x, pos.y, pos.roomName),
        new RoomPosition(pos.x, pos.y + 1, pos.roomName),
        new RoomPosition(pos.x + 1, pos.y - 1, pos.roomName),
        new RoomPosition(pos.x + 1, pos.y, pos.roomName),
        new RoomPosition(pos.x + 1, pos.y + 1, pos.roomName)
    ];
    const terrain = Game.map.getRoomTerrain(room.name);
    let hasConstructionSite = false;
    for (const position of positions) {
        if (terrain.get(position.x, position.y) !== TERRAIN_MASK_WALL) {
            hasConstructionSite = true;
            const status = room.createConstructionSite(position, STRUCTURE_RAMPART);
            if (status === ERR_FULL) break;
        }
    }
    return hasConstructionSite;
}