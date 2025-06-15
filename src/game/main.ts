import { Boot } from './scenes/Boot';
import { Testing } from './scenes/Testing';
import {AUTO, Game} from 'phaser';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#028af8',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800, x: 0 },
      debug: false
    }
  },
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true
  },
  scene: [
    Boot,
    Preloader,
    Testing
  ]
};

const StartGame = ( parent: string ) => {
  return new Game( { ...config, parent } );
};

export default StartGame;