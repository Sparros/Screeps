var calculateMiningSpots = require('function.calculateMiningSpots');

var roleHauler = {
    run: function(creep) {
        // Find all miners in the room
        const miners = _.filter(Game.creeps, (c) => c.memory.role === 'miner');

        // Use the calculateMiningSpots function to get the number of mining spots
        const miningSpots = calculateMiningSpots(creep.room);

        // If the number of miners is less than the number of mining spots, keep collecting from miners
        if (miners.length < miningSpots) {
            // Check if creep is full, find a structure to transfer energy to
            if (creep.memory.isFull && creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.isFull = false;
            }
            // If not full, collect from the most full miner
            if (!creep.memory.isFull) {
                const miners = _.filter(Game.creeps, (c) => c.memory.role === 'miner');
                if (miners.length > 0) {
                    const targetMiner = _.max(miners, (miner) => miner.store[RESOURCE_ENERGY]);
                    if (creep.withdraw(targetMiner, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetMiner, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                    if (creep.store.getFreeCapacity() === 0) {
                        creep.memory.isFull = true;
                    }
                    return;
                }
            }

            // If still not full, find the next closest miner to collect from
            if (!creep.memory.isFull) {
                // Find nearby miners with energy over a quarter full
                const nearbyMiners = miners.filter((miner) => miner.store[RESOURCE_ENERGY] > miner.store.getCapacity() * 0.25);
                // If there are nearby miners, collect from the one with the most energy
                if (nearbyMiners.length > 0) {
                    const targetMiner = _.max(nearbyMiners, (miner) => miner.store[RESOURCE_ENERGY]);
                    if (creep.withdraw(targetMiner, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetMiner, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                    if (creep.store.getFreeCapacity() === 0) {
                        creep.memory.isFull = true;
                    }
                    return;
                }
            }
        } else {
            // If all mining spots are filled, upgrade the controller
            const controller = creep.room.controller;
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        const sources = creep.room.find(FIND_SOURCES);
        const spawnPos = spawn.pos;
        const isSuitableArea = _.some([
                _.every(spawn.room.lookAtArea(LOOK_TERRAIN, spawnPos.y - 1, spawnPos.x - 1, spawnPos.y + 1, spawnPos.x + 3, true),
                    (tile) => tile.terrain === 'plain' || tile.terrain === 'swamp'),
                _.every(spawn.room.lookAtArea(LOOK_TERRAIN, spawnPos.y - 1, spawnPos.x - 1, spawnPos.y + 3, spawnPos.x + 1, true),
                    (tile) => tile.terrain === 'plain' || tile.terrain === 'swamp'),
                _.every(spawn.room.lookAtArea(LOOK_TERRAIN, spawnPos.y - 1, spawnPos.x, spawnPos.y + 1, spawnPos.x + 3, true),
                    (tile) => tile.terrain === 'plain' || tile.terrain === 'swamp'),
                _.every(spawn.room.lookAtArea(LOOK_TERRAIN, spawnPos.y - 1, spawnPos.x - 1, spawnPos.y + 1, spawnPos.x + 2, true),
                    (tile) => tile.terrain === 'plain' || tile.terrain === 'swamp'),
            ]);
        // if controller is level 2, build 1st set of extensions
        if (spawn.room.controller.level == 2) {
            if(isSuitableArea) {
                // Place 5 extensions to the right of the spawn
                spawn.room.createConstructionSite(spawnPos.x + 1, spawnPos.y + 1, STRUCTURE_EXTENSION);
                spawn.room.createConstructionSite(spawnPos.x + 3, spawnPos.y + 1, STRUCTURE_EXTENSION);
                spawn.room.createConstructionSite(spawnPos.x + 2, spawnPos.y, STRUCTURE_EXTENSION);
                spawn.room.createConstructionSite(spawnPos.x + 1, spawnPos.y - 1, STRUCTURE_EXTENSION);
                spawn.room.createConstructionSite(spawnPos.x + 3, spawnPos.y - 1, STRUCTURE_EXTENSION);
            }
            // build roads from spawn to sources
            for (const source of sources) {
                const path = spawn.pos.findPathTo(source, { ignoreCreeps: true });
                for (const step of path) {
                    creep.room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                }
            }
        }
        // if controller is level 3, build 2nd set of extensions
        if (spawn.room.controller.level == 3) {
            if(isSuitableArea) {
                // Place 5 extensions to the top of the spawn
                spawn.room.createConstructionSite(spawnPos.x + 1, spawnPos.y - 2, STRUCTURE_EXTENSION);
                spawn.room.createConstructionSite(spawnPos.x + 3, spawnPos.y - 2, STRUCTURE_EXTENSION);
                spawn.room.createConstructionSite(spawnPos.x + 2, spawnPos.y - 3, STRUCTURE_EXTENSION);
                spawn.room.createConstructionSite(spawnPos.x + 1, spawnPos.y - 4, STRUCTURE_EXTENSION);
                spawn.room.createConstructionSite(spawnPos.x + 3, spawnPos.y - 4, STRUCTURE_EXTENSION);
            }
        }

    },
};

module.exports = roleHauler;
