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
  const [questionLimit, setQuestionLimit] = useState(0);

  const [bank, setBank] = useState(0);
  const [triviaData, setTriviaData] = useState({}); 

  const handleSetPlayers = async (num) => {
    try {
      const res = await fetch(
        "https://mohibsweakestlink.vercel.app/api/questiongen"
      );
  
      if (!res.ok) {
        throw new Error("Failed to fetch trivia");
      }
  
      const responsetriviaData = await res.json();
      setTriviaData(responsetriviaData);
      setQuestionLimit(Math.floor(84 / num));

    } catch (err) {
      console.error("Error fetching trivia:", err);
    }

    setPlayers(num);
    setRound(1);
    
  };

   const handleSetPlayersLeft = (updatedTrivia) => {
      setTriviaData(updatedTrivia);
      setPlayers(prev => prev - 1);
      setRound(2);
  }

  const handleVotingDone = () => {
    if (players > 2) {
      setRound(1);
  }
    else {
      setRound(3);
    }
  }

  const addtoBank = (amount) => {
    setBank(prev => prev + amount);
  }

  const renderRound = () =>{
    switch (round){
        case 0: return <GameSetup setPlayers={handleSetPlayers}/>;
        case 1: return <GamePlay players={players} addtoBank={addtoBank} handleSetPlayersLeft={handleSetPlayersLeft} triviaData={triviaData} questionLimit={questionLimit}/>;
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