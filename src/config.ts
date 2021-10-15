export const STAGES: ProgressStage[] = [
    {rcl: 1, roles: {harvester: 1, hauler: 1}},
    {roles: {harvester: 2, hauler: 2}},
    {roles: {upgrader: 2}},
    {rcl: 2, roles: {defender: 1, upgrader: 3, hauler: 3}, structures: [STRUCTURE_EXTENSION]},
    {roles: {upgrader: 4}},
    {roles: {scout: 1}, structures: ["roadToController"]},
    {rcl: 3, roles: {defender: 2}, structures: ["roadToSources"]},
    {rcl: 4, roles: {supplier: 1}, structures: [STRUCTURE_TOWER]}
];

export const CPU_PRIORITY: {[role: string]: number} = {
    defender: 1,
    supplier: 2,
    hauler: 3,
    harvester: 4,
    builder: 5,
    upgrader: 6,
    scout: 7
};