export function roadsSpawnToController(room: Room): boolean {
    if (!room.controller) return false;

    const roomMemory = room.memory;
    if (roomMemory.roadSpawnToControllerPath) {
        const path = Room.deserializePath(roomMemory.roadSpawnToControllerPath);
        return placeRoads(room, path, (step: PathStep) => {
            const pos = room.controller?.pos
            if (!pos) return false;
            return step.x !== pos.x && step.y !== pos.y;
        });
    }
    else {
        const spawns = room.find(FIND_MY_SPAWNS);
        if (spawns.length === 0) return false;
        const path = room.findPath(spawns[0].pos, room.controller.pos, {
            ignoreCreeps: true,
            ignoreRoads: true
        });
        roomMemory.roadSpawnToControllerPath = Room.serializePath(path);
        return placeRoads(room, path, (step: PathStep) => {
            const pos = room.controller?.pos
            if (!pos) return false;
            return step.x !== pos.x && step.y !== pos.y;
        });
    }
}

export function roadsSpawnToSources(room: Room): boolean {
    const sources = room.find(FIND_SOURCES);
    let allPaths = room.memory.roadSpawnToSourcesPath;
    if (!allPaths) {
        room.memory.roadSpawnToSourcesPath = {};
        allPaths = room.memory.roadSpawnToSourcesPath;
    }
    const spawns = room.find(FIND_MY_SPAWNS);

    let hasConstructionSite = false;
    for (const source of sources) {
        if (allPaths[source.id as string]) {
            const path = Room.deserializePath(allPaths[source.id as string] as string);
            const status = placeRoads(room, path, (step: PathStep) => {
                const pos = source.pos;
                return step.x !== pos.x && step.y !== pos.y;
            });
            if (status) hasConstructionSite = true;
        }
        else {
            const path = room.findPath(spawns[0].pos, source.pos, {
                ignoreCreeps: true
            });
            allPaths[source.id as string] = Room.serializePath(path);
            const status = placeRoads(room, path, (step: PathStep) => {
                const pos = source.pos;
                return step.x !== pos.x && step.y !== pos.y;
            });
            if (status) hasConstructionSite = true;
        }
    }
    return hasConstructionSite;
}

export function roadsAroundSpawn(room: Room): boolean {
    function tileIsFull(pos: RoomPosition): boolean[] {
        let hasConstructionSite = false;
        const siteRoadAtPos: (ConstructionSite<BuildableStructureConstant> | Structure)[] = _.filter(
            room.lookForAt(LOOK_CONSTRUCTION_SITES, pos.x, pos.y),
            site => site.structureType === STRUCTURE_ROAD
        );
        if (siteRoadAtPos.length > 0) hasConstructionSite = true;
        const roadAtPos: Structure[] = _.filter(
            room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y),
            s => s.structureType === STRUCTURE_ROAD
        );
        const allRoadAtPos = siteRoadAtPos.concat(roadAtPos);
        return [allRoadAtPos.length > 0, hasConstructionSite];
    }

    function handleSpawnCircle(spawn: StructureSpawn) {
        const terrain = Game.map.getRoomTerrain(room.name);
        let hasConstructionSite = false;
        if (terrain.get(spawn.pos.x, spawn.pos.y - 1) === 0) {
            // Top
            const pos = new RoomPosition(spawn.pos.x, spawn.pos.y - 1, spawn.pos.roomName);
            const hasRoad = tileIsFull(pos);
            if (!hasRoad[0]) {
                room.createConstructionSite(pos, STRUCTURE_ROAD);
                hasConstructionSite = hasRoad[1]
            }
        }
        if (terrain.get(spawn.pos.x, spawn.pos.y + 1) === 0) {
            // Bottom
            const pos = new RoomPosition(spawn.pos.x, spawn.pos.y + 1, spawn.pos.roomName);
            const hasRoad = tileIsFull(pos);
            if (!hasRoad[0]) {
                room.createConstructionSite(pos, STRUCTURE_ROAD);
                hasConstructionSite = hasRoad[1]
            }
        }
        if (terrain.get(spawn.pos.x - 1, spawn.pos.y) === 0) {
            // Left
            const pos = new RoomPosition(spawn.pos.x - 1, spawn.pos.y, spawn.pos.roomName);
            const hasRoad = tileIsFull(pos);
            if (!hasRoad[0]) {
                room.createConstructionSite(pos, STRUCTURE_ROAD);
                hasConstructionSite = hasRoad[1]
            }
        }
        if (terrain.get(spawn.pos.x + 1, spawn.pos.y) === 0) {
            // Right
            const pos = new RoomPosition(spawn.pos.x + 1, spawn.pos.y, spawn.pos.roomName);
            const hasRoad = tileIsFull(pos);
            if (!hasRoad[0]) {
                room.createConstructionSite(pos, STRUCTURE_ROAD);
                hasConstructionSite = hasRoad[1]
            }
        }
        return hasConstructionSite
    }

    let hasSite = false
    const spawns = room.find(FIND_MY_SPAWNS);
    for (const spawn of spawns) {
        const code = handleSpawnCircle(spawn);
        if (code) hasSite = true;
    }

    return hasSite;
}

function placeRoads(room: Room, path: PathStep[], avoidFunc?: CallableFunction): boolean {
    let hasConstructionSite = false;
    for (const step of path) {
        const siteRoadAtPos: (ConstructionSite<BuildableStructureConstant> | Structure)[] = _.filter(
            room.lookForAt(LOOK_CONSTRUCTION_SITES, step.x, step.y),
            site => site.structureType === STRUCTURE_ROAD
        );
        if (siteRoadAtPos.length > 0) hasConstructionSite = true;
        const roadAtPos: Structure[] = _.filter(
            room.lookForAt(LOOK_STRUCTURES, step.x, step.y),
            site => site.structureType === STRUCTURE_ROAD
        );
        const allRoadAtPos = siteRoadAtPos.concat(roadAtPos);
        if (allRoadAtPos.length === 0) {
            if (avoidFunc) {
                if (!avoidFunc(step)) continue;
            }
            const status = room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
            if (status === ERR_FULL) return true;
            hasConstructionSite = true;
        }
    }
    return hasConstructionSite;
}