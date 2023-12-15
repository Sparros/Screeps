# Screeps Project

This is a repository for the game [Screeps](https://screeps.com/): an open-source sandbox game for programmers where you program your units (called "creeps") to gather resources, build structures, and engage in strategic warfare with other players.

## Scripts

### `main.js`
- **Description**: The main script orchestrating the overall behavior of your colony.
- **Key Features**:
  - Manages the spawning of creeps based on your colony's needs.
  - Coordinates the actions of different roles such as miners and haulers.
  - Handles the development and expansion of your colony infrastructure.

### `role.miner.js`
- **Description**: Controls the behavior of miner creeps responsible for harvesting resources from energy sources.
- **Key Features**:
  - Efficiently harvests energy from designated sources.
  - Coordinates with other creeps for optimal resource collection.

### `role.hauler.js`
- **Description**: Manages the hauling behavior of creeps, responsible for transporting resources between sources and storage.
- **Key Features**:
  - Collects energy from miners and transports it to storage or other structures.
  - Optimizes resource transportation routes for increased efficiency.

## How to Use
1. Clone the repository to your local machine.
2. Upload the scripts to your Screeps account.
3. Configure your Screeps account to execute the `main.js` script.


