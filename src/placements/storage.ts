export function placeStorage(room: Room): boolean {
    if (room.storage) return false;

    const spawns = room.find(FIND_MY_SPAWNS);
    if (spawns.length === 0) return false;

    const pos = spawns[0].pos;
    const positions = [
        new RoomPosition(pos.x, pos.y - 1, pos.roomName),
        new RoomPosition(pos.x, pos.y + 1, pos.roomName),
        new RoomPosition(pos.x - 1, pos.y, pos.roomName),
        new RoomPosition(pos.x + 1, pos.y, pos.roomName)
    ];
    for (const position of positions) {
        const status = placeStorageStructure(room, position);
        if (status) return true;
    }
    return false;
}

function placeStorageStructure(room: Room, pos: RoomPosition): boolean {
    const terrain = Game.map.getRoomTerrain(room.name);
    if (terrain.get(pos.x, pos.y) === TERRAIN_MASK_WALL) return false;

    const objectsAtPos = room.lookAt(pos).filter(result => result.type === "structure");
    for (const object of objectsAtPos) {
        const struct = object.structure?.structureType;
        if (struct === STRUCTURE_ROAD) {
            object.structure?.destroy();
        }
        else if (struct !== STRUCTURE_RAMPART) return false;
    }

    room.createConstructionSite(pos, STRUCTURE_STORAGE);
    return true;
}