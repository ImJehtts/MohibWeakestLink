import React from 'react';

export const WinnerScreen = ({bank}) => {

    const handlePlayAgain = () => {
        window.location.reload();
    };

    return (
    <div className="WinnerContainer">
        <h1>Congratulations to the Winner!</h1>
        <h2>You won ${bank}!</h2>
        <button style={{ marginTop: '2rem' }} onClick={handlePlayAgain}>Play Again</button>
    </div>
    )
}

export default WinnerScreen