import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super( 'Preloader' );
  }

  init() {
    this.add.image( 512, 384, 'background' );

    this.add.rectangle( 512, 384, 468, 32 ).setStrokeStyle( 1, 0xffffff );

    const bar = this.add.rectangle( 512 - 230, 384, 4, 28, 0xffffff );

    this.load.on( 'progress', ( progress: number ) => {

      bar.width = 4 + 460 * progress;

    } );
  }

  preload() {
    this.load.setPath( 'assets' );

    this.load.atlas( 'swordMasterAtlas', 'SwordMaster/swordmaster.png', 'SwordMaster/swordmaster.json' );
    this.load.atlas( 'bloodSwordsmanAtlas', 'SwordMaster/Blood_Swordsman.png', 'SwordMaster/Blood_Swordsman.json' );
    this.load.atlas( 'lordOfFlamesAtlas', 'SwordMaster/Lord_Flames.png', 'SwordMaster/Lord_Flames.json' );
    this.load.atlas( 'holySamuraiAtlas', 'SwordMaster/Glitch_Samurai.png', 'SwordMaster/Glitch_Samurai.json' );
    this.load.atlas( 'daggerBanditAtlas', 'DaggerBandit/Dagger_Bandit.png', 'DaggerBandit/Dagger_Bandit.json' );
    this.load.atlas( 'prophetAtlas', 'Prophet/prophet.png', 'Prophet/prophet.json' );

    this.load.atlas( 'templeAtlas', 'Temple/temple.png', 'Temple/temple.json' );

    this.load.tilemapTiledJSON("avenWood", "maps/AvenWood/AvenWood.tmj");
    this.load.image("mainTileSheet", "maps/AvenWood/mainTileSheet.png");
    this.load.image("bg", "maps/AvenWood/bg.png");
    this.load.image("bg1", "maps/AvenWood/bg1.png");
    this.load.image("bg2", "maps/AvenWood/bg2.png");
    this.load.image("bg3", "maps/AvenWood/bg3.png");
    this.load.image("bg4", "maps/AvenWood/bg4.png");
    this.load.image("sun", "maps/AvenWood/sun.png");

    this.load.tilemapTiledJSON("gehennaDeep", "maps/GehennaDeep/GehennaDeep.tmj");
    this.load.image("mainCave", "maps/GehennaDeep/mainCave.png");
    this.load.image("crossSectionBG", "maps/GehennaDeep/crossSectionBG.png");
    this.load.image("hangersBG", "maps/GehennaDeep/hangersBG.png");
    this.load.image("horizontalColumnsBG", "maps/GehennaDeep/horizontalColumnsBG.png");
    this.load.image("Small1BG", "maps/GehennaDeep/Small1BG.png");
    this.load.image("Small3BG", "maps/GehennaDeep/Small3BG.png");
    this.load.image("Small2BG", "maps/GehennaDeep/Small2BG.png");

    this.load.on('loaderror', (file: any) => {
    });
  }

  create() {
    this.scene.start( 'GehennaDeep' );
  }
}
