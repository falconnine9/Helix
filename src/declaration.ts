declare global {
    const ROAD_SPAWN_TO_CONTROLLER = "roadToController";
    const ROAD_SPAWN_TO_SOURCES = "roadToSources";
    const ROAD_SPAWN_TO_EXITS = "roadToExits";

    interface Creep {
        energyAmount(): number;
        energyCapacity(): number;
        isCombative(): boolean;
        travelTo(
            target: RoomPosition | _HasRoomPosition,
            reactionTime?: number
        ): CreepMoveReturnCode | -2 | -5 | -7;
        wander(): CreepMoveReturnCode;
    }

    interface CreepMemory {
        role: string;
        origin?: string;
        state: string;
    }

    interface Memory {
        creepIndex: number;
        allies: string[];
        scoutInfo: {[room: string]: ScoutEntry};
        towerList: Id<StructureTower>[];
    }

    interface Room {
        getCreepsOfRole(role: string): number;
        getExitTiles(): RoomPosition[];
        getTileRatio(): RoomTileRatios;
    }

    interface RoomMemory {
        exitTiles: RoomPosition[] | undefined;
        wallHitsLimit: number;
    }

    interface RoomPosition {
        isBorderTile(): boolean;
    }

    interface RoomTileRatios {
        plain: number;
        swamp: number;
        wall: number;
    }

    interface ProgressStage {
        rcl?: number;
        roles?: {[role: string]: number};
        structures?: Array<BuildableStructureConstant | "roadToSources" | "roadToController" | "roadToExits">;
    }

    interface Structure {
        isWall(): boolean;
    }

    interface Tombstone extends RoomObject {
        energyAmount(): number;
    }

    function getById<T>(id: Id<T> | null | undefined): T | null;
}

export function injectMethods(): void {
    global.getById = <T>(id: Id<T> | null | undefined): T | null => {
        return id ? Game.getObjectById(id) as T : null;
    }

    Creep.prototype.energyAmount = function(): number {
        return this.store.getUsedCapacity(RESOURCE_ENERGY);
    }

    Creep.prototype.energyCapacity = function(): number {
        return this.store.getFreeCapacity(RESOURCE_ENERGY);
    }

    Creep.prototype.isCombative = function(): boolean {
        const role = this.memory.role;
        return role === "defender" || role === "soldier";
    }

    Creep.prototype.travelTo = function(
        target: RoomPosition | _HasRoomPosition,
        reactionTime?: number
    ): CreepMoveReturnCode | -2 | -5 | -7 {
        const movePosition = target instanceof RoomPosition ? target : target.pos;
        if (this.pos.isNearTo(movePosition)) return OK;
        return this.moveTo(movePosition, {
            reusePath: reactionTime ? reactionTime : 10
        });
    }

    Creep.prototype.wander = function(): CreepMoveReturnCode {
        const direction = [1, 3, 5, 7][Math.floor(Math.random() * 4)] as DirectionConstant;
        return this.move(direction);
    }

    Room.prototype.getCreepsOfRole = function(role: string): number {
        return _.filter(
            Game.creeps,
            c => c.memory.origin === this.name && c.memory.role === role
        ).length;
    }

    Room.prototype.getExitTiles = function(): RoomPosition[] {
        const terrain = Game.map.getRoomTerrain(this.name);
        const exitTiles: RoomPosition[] = [];
        for (let x = 0; x < 50; x++) {
            if (terrain.get(x, 0) !== 0) continue;
            exitTiles.push(new RoomPosition(x, 0, this.name));
        }
        for (let x = 0; x < 50; x++) {
            if (terrain.get(x, 49) !== 0) continue;
            exitTiles.push(new RoomPosition(x, 49, this.name));
        }
        for (let y = 0; y < 50; y++) {
            if (terrain.get(0, y) !== 0) continue;
            exitTiles.push(new RoomPosition(0, y, this.name));
        }
        for (let y = 0; y < 50; y++) {
            if (terrain.get(49, y) !== 0) continue;
            exitTiles.push(new RoomPosition(49, y, this.name));
        }
        return exitTiles;
    }

    Room.prototype.getTileRatio = function(): RoomTileRatios {
        const terrain = Game.map.getRoomTerrain(this.name);
        let plain = 0;
        let swamp = 0;
        let wall = 0;
        for (let x = 0; x < 50; x++) {
            for (let y = 0; y < 50; y++) {
                switch (terrain.get(x, y)) {
                    case 0:
                        plain++;
                        break;
                    case TERRAIN_MASK_SWAMP:
                        swamp++;
                        break;
                    case TERRAIN_MASK_WALL:
                        wall++;
                        break;
                }
            }
        }
        return {
            plain: plain / (50 * 50),
            swamp: swamp / (50 * 50),
            wall: wall / (50 * 50)
        }
    }

    RoomPosition.prototype.isBorderTile = function(): boolean {
        return this.x === 0 || this.x === 49 || this.y === 0 || this.y === 49;
    }

    Structure.prototype.isWall = function(): boolean {
        return this.structureType === STRUCTURE_WALL || this.structureType === STRUCTURE_RAMPART;
    }

    Tombstone.prototype.energyAmount = function(): number {
        return this.store.getUsedCapacity(RESOURCE_ENERGY);
    }
}