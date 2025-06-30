export interface TilesetConfig {
  name: string;
  key: string;
}

export interface ParallaxConfig {
  name: string;
  factor: number;
}

export interface TileMapConfig {
  mapKey: string;
  tilesets: TilesetConfig[];
  parallaxLayers?: ParallaxConfig[];
  scale: number;
  collisionLayers: string[];
}

export class TileMapComponent {
  private scene: Phaser.Scene;
  private map: Phaser.Tilemaps.Tilemap;
  private world: Phaser.Physics.Arcade.StaticGroup;
  private config: TileMapConfig;

  constructor(scene: Phaser.Scene, config: TileMapConfig) {
    this.scene = scene;
    this.config = config;
    this.world = scene.physics.add.staticGroup();
  }

  public create() {
    this.createMap();
    this.createLayers();
    this.createCollisionRects();
    return { map: this.map, world: this.world };
  }

  private createMap(){
    this.map = this.scene.add.tilemap(this.config.mapKey);

    const tilesets = this.config.tilesets.map(tilesetConfig => {
      const tileset = this.map.addTilesetImage(tilesetConfig.name, tilesetConfig.key);
      if (!tileset) {
        throw new Error(`Failed to load tileset: ${tilesetConfig.name} with key: ${tilesetConfig.key}`);
      }
      return tileset;
    });

    this.map.tilesets = tilesets;
  }

  private createLayers(){
    this.map.layers.forEach(layer => {
      const layerObj = this.map.createLayer(layer.name, this.map.tilesets);

      if (layerObj) {
        layerObj.setScale(this.config.scale);

        if (layer.name.includes('background')) {
          if (this.config.parallaxLayers) {
            const parallax = this.config.parallaxLayers.find(config =>
              layer.name.includes(config.name)
            );
            if (parallax) {
              layerObj.setScrollFactor(parallax.factor, 1);
            }
          }
          layerObj.setDepth(-1);
        } else {
          layerObj.setDepth(100);
        }
      }
    });
  }

  private createCollisionRects(){
    this.config.collisionLayers.forEach(layerName => {
      const collisionLayer = this.map.getObjectLayer(layerName);

      if (collisionLayer && collisionLayer.objects) {
        collisionLayer.objects.forEach((obj: any) => {
          const collisionRect = this.scene.add.rectangle(
            obj.x * this.config.scale,
            obj.y * this.config.scale,
            obj.width * this.config.scale,
            obj.height * this.config.scale,
            0x000000,
            0.8
          );
          collisionRect.setOrigin(0, 0);
          this.world.add(collisionRect);
        });
      }
    });
  }

  public getMapDimensions() {
    return {
      width: this.map.widthInPixels * this.config.scale,
      height: this.map.heightInPixels * this.config.scale
    };
  }

  public getObjectLayer(layerName: string) {
    return this.map.getObjectLayer(layerName);
  }
}
