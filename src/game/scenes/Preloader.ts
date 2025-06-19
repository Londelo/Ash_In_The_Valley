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

    this.load.image( 'logo', 'logo.png' );
    this.load.image( 'star', 'star.png' );

    // Load the main character as a texture atlas
    this.load.atlas( 'mainCharacterAtlas', 'mainCharacterOne.png', 'mainCharacterOne.json' );

    // Load the Dagger Bandit as a texture atlas
    console.log('Loading Dagger Bandit atlas...');
    this.load.atlas( 'daggerBanditAtlas', 'Dagger_Bandit.png', 'Dagger_Bandit.json' );

    // Add load event listeners for debugging
    this.load.on('filecomplete-atlas-daggerBanditAtlas', () => {
      console.log('Dagger Bandit atlas loaded successfully!');
    });

    this.load.on('loaderror', (file: any) => {
      console.error('Failed to load file:', file.key, file.src);
    });
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    // Verify assets are loaded
    console.log('Preloader create() - Available textures:', Object.keys(this.textures.list));

    if (this.textures.exists('daggerBanditAtlas')) {
      console.log('✓ Dagger Bandit atlas is available');
    } else {
      console.error('✗ Dagger Bandit atlas is NOT available');
    }

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start( 'Testing' );
  }
}
