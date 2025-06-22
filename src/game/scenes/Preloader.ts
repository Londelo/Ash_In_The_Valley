import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super( 'Preloader' );
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image( 512, 384, 'background' );

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle( 512, 384, 468, 32 ).setStrokeStyle( 1, 0xffffff );

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle( 512 - 230, 384, 4, 28, 0xffffff );

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on( 'progress', ( progress: number ) => {

      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;

    } );
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath( 'assets' );

    this.load.atlas( 'swordMasterAtlas', 'SwordMaster/swordmaster.png', 'SwordMaster/swordmaster.json' );

    this.load.atlas( 'daggerBanditAtlas', 'DaggerBandit/Dagger_Bandit.png', 'DaggerBandit/Dagger_Bandit.json' );

    this.load.atlas( 'prophetAtlas', 'Prophet/prophet.png', 'Prophet/prophet.json' );

    this.load.atlas( 'templeAtlas', 'Temple/temple.png', 'Temple/temple.json' );

    // Load tilemap assets with unique keys matching tileset names
    this.load.image("mainTileSheet", "maps/AvenWood/mainTileSheet.png");
    this.load.image("bg", "maps/AvenWood/bg.png");
    this.load.image("bg1", "maps/AvenWood/bg1.png");
    this.load.image("bg2", "maps/AvenWood/bg2.png");
    this.load.image("bg3", "maps/AvenWood/bg3.png");
    this.load.image("bg4", "maps/AvenWood/bg4.png");
    this.load.image("sun", "maps/AvenWood/sun.png");

    this.load.tilemapTiledJSON("avenWood", "maps/AvenWood/AvenWood.tmj");

    this.load.on('loaderror', (file: any) => {
      console.error('Failed to load file:', file.key, file.src);
    });
  }

  create() {
    this.scene.start( 'AvenWood' );
  }
}