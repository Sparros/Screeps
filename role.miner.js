var roleMiner = {
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var closestSource = creep.pos.findClosestByRange(sources);

        if (closestSource) {
            if (creep.harvest(closestSource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSource, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};

module.exports = roleMiner;
