import React, { useState } from 'react';

export const GameSetup = ({ setPlayers }) => {
  const [numPlayers, setNumPlayers] = useState(2);

  const incrementPlayers = () => setNumPlayers(prev => prev + 1);

  const decrementPlayers = () => {
    if (numPlayers > 2) setNumPlayers(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlayers(numPlayers); 
  };

  return (
    <div className='GameSetupContainer'>
        <h3 className="title">Welcome to the Weakest Link!</h3>
        <div className='GameSetup'>
            <h1>Please Select Number of Players</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <h2 className="players">Number of Players: </h2>
                    <button type="button" onClick={decrementPlayers} disabled={numPlayers <= 2}>↓</button>
                    <input 
                        id="players" 
                        type="number" 
                        value={numPlayers} 
                        readOnly
                    />
                    <button type="button" onClick={incrementPlayers} disabled={numPlayers >= 8}>↑</button>
                </div>
                <button type="submit">Submit</button>
            </form>
            <h2>*Please Number Your Players Accordingly*</h2>
            <h2 style={{ fontSize: '1.25rem', marginTop: '-1rem' }}>*Please Use PC/Laptop in Full Screen! Mobile Not Supported*</h2>
        </div>
    </div>
);
};

export default GameSetup;
