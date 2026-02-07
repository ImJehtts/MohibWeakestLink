import React, { useState, useEffect } from 'react';

export const MidRound = ({players, bank, handleVotingDone}) => {

    const [timer, setTimer] = useState(10); 
    const [isVotingOver, setIsVotingOver] = useState(false);

    useEffect(() => {
        if (timer > 0) {
          const timerInterval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
          }, 1000);
    
          return () => clearInterval(timerInterval);
        } 
        else{
            setIsVotingOver(true);
        }
      }, [timer]);

    return (
    <div className="VotingContainer">
        <div className="GameTimer">
            Time Left: {timer}s
        </div>
        <div className='VotingRound'>
            <h1>Please Vote A Player to Remove</h1>
            <h2>Players Left: {players}</h2>
            <h2>Value in bank: {bank}</h2>
            <button 
            onClick={handleVotingDone}
            disabled={timer > 0 && !isVotingOver}
            >Next Round</button>
            <h2 style={{marginTop: '3rem'}}>*Players re-number your players accordingly*</h2>
        </div>
    </div>
    )
}

export default MidRound