import React, { useState, useEffect } from 'react';

export const GamePlay = ({players, addtoBank, handleSetPlayersLeft, triviaData, questionLimit }) => {
    const moneyAmounts = [1000, 800, 600, 450, 300, 200, 100, 50, 20];
    
    // State to track the current money amount, the accumulated Bank value, and the total score
    const [currentAmount, setCurrentAmount] = useState(moneyAmounts[8]); 
    const [bankValue, setBankValue] = useState(0);
    const [total, setTotal] = useState(0); 

    const [timer, setTimer] = useState(60); 
    const [isRoundActive, setIsRoundActive] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);

    const [localTrivia, setLocalTrivia] = useState(triviaData);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const questionKeys = Object.keys(localTrivia);
    const currentQuestion = questionKeys[0];

    const moveToNextQuestion = () => {
        const nextTrivia = { ...localTrivia };
        delete nextTrivia[currentQuestion];
        setLocalTrivia(nextTrivia);
        setQuestionsAnswered(prev => prev + 1);
        setShowAnswer(false);
    };
    
    // Function to handle button presses
    const handleButtonPress = (buttonType) => {
        setIsProcessing(true);

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
            moveToNextQuestion();
        } else if (buttonType === 'Bank') {
            // Add current value to Bank, reset to $20
            setBankValue(prevBank => prevBank + total);
            setCurrentAmount(moneyAmounts[8]); 
            setTotal(0); // Reset total when banking
        } else {
            // If "Wrong" is selected, reset to $20 and reset total
            setCurrentAmount(moneyAmounts[8]); 
            setTotal(0);
            moveToNextQuestion();
        }

        setTimeout(() => {
            setIsProcessing(false);
        }, 1000);
    };

    // Timer effect to countdown every second
    useEffect(() => {
        if (timer > 0 && questionsAnswered < questionLimit) {
            const timerInterval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);

            // Clear the interval when the timer reaches 0
            return () => clearInterval(timerInterval);
        } else {
            // When timer hits 0, disable other buttons
            setIsRoundActive(true); 
        }
    }, [timer, questionsAnswered, questionLimit]);

    useEffect(() => {
        if (Object.keys(localTrivia).length === 0 && !isRoundActive) {
            setTimer(0);
            setIsRoundActive(true);
        }
    }, [localTrivia, isRoundActive]);

    // Handle Voting Round button click
    const handleVotingRound = () => {
        addtoBank(bankValue);
        handleSetPlayersLeft(localTrivia);
    };

    const getDisplayText = () => {
        if (questionsAnswered >= questionLimit) return "Finished questions for this round";
        if (!currentQuestion) return "No more questions available!";
        return showAnswer ? localTrivia[currentQuestion] : currentQuestion;
    };

    return (
        <div className="GamePlayContainer">
            <div className="GameTimer">Time Left: {timer}s</div>
            <div className="GamePlay">
                <div className="MoneyColumn">
                    <div className="MoneyLadder">
                        {moneyAmounts.map((amount, index) => (
                            <div key={index} className={`MoneyBubble ${amount === currentAmount ? 'active' : ''}`}>
                                ${amount}
                            </div>
                        ))}
                    </div>
                    <div className="BankAmount">Bank: ${bankValue}</div>
                </div>

                <div className="QuestionCard">
                    <h1 className="QuestionText">{getDisplayText()}</h1>

                    {questionsAnswered < questionLimit && currentQuestion && (
                        <>
                            <button onClick={() => setShowAnswer(!showAnswer)}>
                                {showAnswer ? "Hide Answer" : "Show Answer"}
                            </button>

                            <div className="AnswerButtons">
                                <button className="Wrong" onClick={() => handleButtonPress('Wrong')} disabled={isRoundActive || isProcessing}>Wrong</button>
                                <button className="Bank" onClick={() => handleButtonPress('Bank')} disabled={isRoundActive || isProcessing}>Bank</button>
                                <button className="Correct" onClick={() => handleButtonPress('Correct')} disabled={isRoundActive || isProcessing}>Correct</button>
                            </div>
                        </>
                    )}

                    <button className="VotingButton" disabled={!isRoundActive} onClick={handleVotingRound}>
                        Voting Round
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GamePlay;