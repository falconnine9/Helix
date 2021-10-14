export const STAGES: ProgressStage[] = [
    {rcl: 1, roles: {harvester: 1, hauler: 1}},
    {roles: {harvester: 2, hauler: 2, upgrader: 1}},
    {roles: {upgrader: 2, scout: 1}},
    {rcl: 2, roles: {hauler: 3, upgrader: 3}}
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