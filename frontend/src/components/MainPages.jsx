import React from 'react';
import GameSetup from './GameSetup';


function MainPages() {
  const [playersLeft, setPlayersLeft] = React.useState(0);
  const [players, setPlayers] = React.useState(0);

  return (
    <div className="App">
        <GameSetup setPlayers={setPlayers}/>
    </div>
  );
}

export default MainPages;