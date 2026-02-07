import React, { useState } from 'react';
import GameSetup from './GameSetup';
import GamePlay from './GamePlay';
import MidRound from './MidRound';
import WinnerScreen from './WinnerScreen';


function MainPages() {
  const [players, setPlayers] = useState(0);

  // Round 0: Game Setup
  // Round 1: Game Play
  // Round 2: Voting Round
  const [round, setRound] = useState(0);

  const [bank, setBank] = useState(0);

  const handleSetPlayers = (num) => {
    setPlayers(num);
    setRound(1);
    console.log("Players set to: ", num);
  };

   const handleSetPlayersLeft = () => {
      if (players > 2) {
        setPlayers(prev => prev - 1);
        setRound(2);
    }
    else{
      setRound(3);
    }
  }

  const handleVotingDone = () => {
    setRound(1);
  }

  const addtoBank = (amount) => {
    setBank(prev => prev + amount);
  }

  const renderRound = () =>{
    switch (round){
        case 0: return <GameSetup setPlayers={handleSetPlayers}/>;
        case 1: return <GamePlay players={players} addtoBank={addtoBank} handleSetPlayersLeft={handleSetPlayersLeft}/>;
        case 2: return <MidRound players={players} bank={bank} handleVotingDone={handleVotingDone}/>;
        case 3: return <WinnerScreen bank={bank}/>;
        default: return null;
    }
  }

  return (
    <div className="content">
      {renderRound()}
    </div>
  );
}

export default MainPages;