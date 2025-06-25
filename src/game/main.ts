import { Boot } from './scenes/Boot';
import AvenWood from './scenes/avenwood';
import {AUTO, Game} from 'phaser';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1500,
  height: 650,
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
    AvenWood
  ]
};

const StartGame = ( parent: string ) => {
  return new Game( { ...config, parent } );
};

export default StartGame;