import React, { useState, useEffect } from 'react';

export const GamePlay = ({ players, addtoBank, handleSetPlayersLeft }) => {
    const moneyAmounts = [1000, 800, 600, 450, 300, 200, 100, 50, 20];
    
    // State to track the current money amount, the accumulated Bank value, and the total score
    const [currentAmount, setCurrentAmount] = useState(moneyAmounts[8]); 
    const [bankValue, setBankValue] = useState(0);
    const [total, setTotal] = useState(0); 

    const [timer, setTimer] = useState(20); 
    const [isRoundActive, setIsRoundActive] = useState(false);

    const questionMap = {
        "What colour is the sky?": "Blue"
    };

    const currentQuestion = Object.keys(questionMap)[0];

    const [showAnswer, setShowAnswer] = useState(false);
    
    // Function to handle button presses
    const handleButtonPress = (buttonType) => {
        if (buttonType === 'Correct') {
            // Move to the next money amount if "Correct"
            const currentIndex = moneyAmounts.indexOf(currentAmount);
            if (currentIndex === 0) {
                setTotal(prevTotal => prevTotal === 800 ? 1000 : prevTotal + 1000);
            } 
            else {
                setTotal(currentAmount);
                const nextAmount = moneyAmounts[currentIndex - 1];
                setCurrentAmount(nextAmount);
            }
        } else if (buttonType === 'Bank') {
            // Add current value to Bank, reset to $20
            setBankValue(prevBank => prevBank + total);
            setCurrentAmount(moneyAmounts[8]); 
            setTotal(0); // Reset total when banking
        } else {
            // If "Wrong" is selected, reset to $20 and reset total
            setCurrentAmount(moneyAmounts[8]); 
            setTotal(0);
        }
    };

    // Timer effect to countdown every second
    useEffect(() => {
        if (timer > 0) {
            const timerInterval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);

            // Clear the interval when the timer reaches 0
            return () => clearInterval(timerInterval);
        } else {
            // When timer hits 0, disable other buttons
            setIsRoundActive(true); 
        }
    }, [timer]);

    // Handle Voting Round button click
    const handleVotingRound = () => {
        addtoBank(bankValue);
        handleSetPlayersLeft();
    };

    return (
        <div className="GamePlayContainer">
            <div className="GameTimer">
                Time Left: {timer}s
            </div>

            <div className="GamePlay">
                <div className="MoneyColumn">
                    <div className="MoneyLadder">
                        {moneyAmounts.map((amount, index) => (
                            <div
                                key={index}
                                className={`MoneyBubble ${amount === currentAmount ? 'active' : ''}`}
                            >
                                ${amount}
                            </div>
                        ))}
                    </div>

                    <div className="BankAmount">
                        Bank: ${bankValue}
                    </div>
                </div>

                <div className="QuestionCard">
                    <h1 className="QuestionText">
                        {showAnswer ? questionMap[currentQuestion] : currentQuestion}
                    </h1>

                    <button onClick={() => setShowAnswer(!showAnswer)}>
                        {showAnswer ? "Hide Answer" : "Show Answer"}
                    </button>

                    <div className="AnswerButtons">
                        <button className= "Wrong" onClick={() => {handleButtonPress('Wrong'); setShowAnswer(false); }} disabled={timer === 0 || isRoundActive}>
                            Wrong
                        </button>
                        <button className= "Bank" onClick={() => {handleButtonPress('Bank'); setShowAnswer(false); }} disabled={timer === 0 || isRoundActive}>
                            Bank
                        </button>
                        <button className= "Correct" onClick={() => {handleButtonPress('Correct'); setShowAnswer(false); }} disabled={timer === 0 || isRoundActive}>
                            Correct
                        </button>
                    </div>

                    <button
                        className="VotingButton"
                        disabled={!isRoundActive}
                        onClick={handleVotingRound}
                    >
                        Voting Round
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GamePlay;