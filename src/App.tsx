import {useRef} from 'react';
import {IRefPhaserGame, PhaserGame} from './PhaserGame';
import AvenWood from './game/scenes/avenwood';

function App() {

  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>( null );

  const changeScene = () => {

    if( phaserRef.current ) {
      const scene = phaserRef.current.scene;

      if ( scene ) {
        if ( scene.scene.key === 'AvenWood' ) {
          ( scene as AvenWood ).changeScene();
        } else if ( 'changeScene' in scene ) {
          ( scene as any ).changeScene();
        }
      }
    }
  };

  // Event emitted from the PhaserGame component, can do things based on the current active scene
  const currentScene = ( scene: Phaser.Scene ) => {};

  return (
    <div id="app">
      <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
      <div>
        <div>
          <button className="button" onClick={changeScene}>Change Scene</button>
        </div>
      </div>
    </div>
  );
}

export default App;