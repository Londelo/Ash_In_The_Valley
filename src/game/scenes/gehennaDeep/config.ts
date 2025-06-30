import { TileMapConfig } from '../../components/TileMap';

export interface LocationSpawnConfig {
  maxEnemies: number;
  spawnInterval: number;
  spawnRadius: number;
  respawnDelay: number;
  autoStart: boolean;
}

export interface LocationConfigs {
  [locationName: string]: LocationSpawnConfig;
}

const config = {
  backgroundColor: 0x87CEEB,

  world_width: 3000,
  world_height: 800,

  ground_y: 700,
  ground_height: 700,
  ground_color: 0x260101,

  left_wall_x: 20,
  left_wall_width: 40,
  left_wall_height: 768,
  left_wall_color: 0x654321,

  right_wall_x: 3052,
  right_wall_width: 40,
  right_wall_height: 768,
  right_wall_color: 0x654321,

  player_start_x: 400,
  player_start_y: 560,

  prophet_start_x: 800,
  prophet_start_y: 678,

  temple_x: 2629,
  temple_y: 655,

  tileMapConfig: {
    mapKey: "gehennaDeep",
    tilesets: [
      { name: "mainCave", key: "mainCave" },
      { name: "crossSectionBG", key: "crossSectionBG" },
      { name: "hangersBG", key: "hangersBG" },
      { name: "horizontalColumnsBG", key: "horizontalColumnsBG" },
      { name: "Small1BG", key: "Small1BG" },
      { name: "Small2BG", key: "Small2BG" },
      { name: "Small3BG", key: "Small3BG" }
    ],
    scale: 3,
    collisionLayers: ['floor']
  } as TileMapConfig,

  // Location-based spawn configurations
  locationConfigs: {
    entrance: {
      maxEnemies: 2,
      spawnInterval: 6000,
      spawnRadius: 80,
      respawnDelay: 4000,
      autoStart: true
    },
    cavern: {
      maxEnemies: 4,
      spawnInterval: 4000,
      spawnRadius: 100,
      respawnDelay: 3000,
      autoStart: true
    },
    depths: {
      maxEnemies: 6,
      spawnInterval: 3000,
      spawnRadius: 120,
      respawnDelay: 2000,
      autoStart: true
    },
    chamber: {
      maxEnemies: 3,
      spawnInterval: 5000,
      spawnRadius: 90,
      respawnDelay: 3500,
      autoStart: true
    }
  } as LocationConfigs
}

export default config;