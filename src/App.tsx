import {useRef} from 'react';
import {IRefPhaserGame, PhaserGame} from './PhaserGame';
import AvenWood from './game/scenes/avenwood';

function App() {

  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>( null );
  // Event emitted from the PhaserGame component, can do things based on the current active scene
  const currentScene = ( scene: Phaser.Scene ) => {};

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
      <div>
        <div>
          Controls:
          <li>Arrow Keys to move</li>
          <li>R to Attack</li>
          <li>E to Heavy Air Attack</li>
          <li>Q to Dash</li>
          <li>T to Interact</li>
        </div>
      </div>
    </div>
  );
}

export default App;
