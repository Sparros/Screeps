var roleMiner = require('role.miner');

module.exports.loop = function () {
    const spawns = Object.values(Game.spawns);
    const homeRoom = spawns.length > 0 ? spawns[0].room : null;

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Counter to keep track of the spawn order
    let spawnOrderCounter = Memory.spawnOrderCounter || 0;
    const extenstionCount = homeRoom ? homeRoom.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION } }).length : 0;

    // Determine creep body parts based on controller level
    let minerBody, haulerBody;
    if (homeRoom && homeRoom.controller.level < 2) {
        // Use basic creep bodies before reaching Controller Level 2
        minerBody = [WORK, CARRY, MOVE];
        haulerBody = [CARRY, CARRY, MOVE];
    } else if (extenstionCount == 5) {
        // Use upgraded creep bodies after reaching Controller Level 2 and 5 extensions
        minerBody = [WORK, WORK, WORK, WORK, CARRY, MOVE];
        haulerBody = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
    }

    // Calculate the number of miners and haulers needed based on available mining spots
    const miningSpots = homeRoom ? calculateMiningSpots(homeRoom) : 0;
    const minersToSpawn = Math.min(2, miningSpots); // Spawn up to 2 miners at a time
    const haulersToSpawn = Math.ceil(miningSpots / 2); // Spawn 1 hauler for every 2 miners

    // Spawn miners and haulers based on the counter and mining spots
    if (spawnOrderCounter % 3 === 0 && minersToSpawn > 0) {
        const newName = 'Miner' + Game.time;
        spawns[0].spawnCreep(minerBody, newName, { memory: { role: 'miner' } });
        spawnOrderCounter++;
    } else if (spawnOrderCounter % 3 === 1 && haulersToSpawn > 0) {
        const newName = 'Hauler' + Game.time;
        spawns[0].spawnCreep(haulerBody, newName, { memory: { role: 'hauler' } });
        spawnOrderCounter++;
    }

    // Run creeps
    for (const creep of Object.values(Game.creeps)) {
        if (creep.memory.role === 'miner') {
            roleMiner.run(creep);
        }
        if (creep.memory.role === 'hauler') {
            roleHauler.run(creep);
        }
    }

function calculateMiningSpots(room) {
    return room.find(FIND_SOURCES_ACTIVE).reduce((count, source) => {
        const terrain = room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
        const walkableTiles = terrain.filter(tile => tile.terrain === 'plain' || tile.terrain === 'swamp').length;
        const miners = _.filter(Game.creeps, (creep) => creep.memory.role === 'miner');
        const miningSpots = walkableTiles.length - miners.length;
        return Math.max(miningSpots, 0); // Ensure a non-negative value
    }, 0);
}
}
