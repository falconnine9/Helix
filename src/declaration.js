module.exports.injectMethods = () => {
    Creep.prototype.moveToInRoom = pos => {
        const roomMemory = Memory.rooms[pos.roomName];
        if (roomMemory.exitTiles) {
            this.moveTo(pos, {
                avoid: roomMemory.exitTiles,
                visualizePathStyle: {}
            });
        }
        else {
            let tiles = [];
            tiles.concat(iterateHorizontal(pos.roomName, 0));
            tiles.concat(iterateHorizontal(pos.roomName, 49));
            tiles.concat(iterateVertical(pos.roomName, 0));
            tiles.concat(iterateVertical(pos.roomName, 49));
            Memory.rooms[pos.roomName].exitTiles = tiles;
            this.moveToInRoom(pos);
        }
    }

    Creep.prototype.returnToOrigin = () => {
        const exitDirection = Game.map.findExit(
            this.room.name,
            this.memory.origin
        );
        this.moveTo(this.pos.findClosestByRange(exitDirection));
    }
}


function iterateHorizontal(room, y) {
    const terrain = Game.map.getRoomTerrain(room);
    let tiles = [];

    for (let x = 0; x < 50; x++) {
        if (terrain.get(x, y) === 0) {
            tiles.push(RoomPosition(x, y, room));
        }
    }

    return tiles;
}


function iterateVertical(room, x) {
    const terrain = Game.map.getRoomTerrain(room);
    let tiles = [];

    for (let y = 0; y < 50; y++) {
        if (terrain.get(x, y) === 0) {
            tiles.push(RoomPosition(x, y, room));
        }
    }

    return tiles;
}