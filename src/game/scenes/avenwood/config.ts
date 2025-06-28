import { TileMapConfig } from '../../components/TileMap';

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
    mapKey: "avenWood",
    tilesets: [
      { name: "mainTileSheet", key: "mainTileSheet" },
      { name: "bg", key: "bg" },
      { name: "bg1", key: "bg1" },
      { name: "bg2", key: "bg2" },
      { name: "bg3", key: "bg3" },
      { name: "bg4", key: "bg4" },
      { name: "sun", key: "sun" }
    ],
    parallaxLayers: [
      { name: 'BG_0', factor: 0.1 },
      { name: 'BG_1', factor: 0.2 },
      { name: 'BG_2', factor: 0.4 },
      { name: 'BG_3', factor: 0.6 },
      { name: 'BG_4', factor: 0.8 },
    ],
    scale: 2,
    collisionLayers: ['ground/ground_collision']
  } as TileMapConfig
}

export default config;