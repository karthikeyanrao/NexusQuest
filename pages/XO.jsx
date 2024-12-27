import React, { useState } from 'react';

const XO = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [currentWinner, setCurrentWinner] = useState(null);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 4, 6],            // Diagonals
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || currentWinner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    const winner = calculateWinner(newBoard);

    if (winner) {
      setScores({ ...scores, [winner]: scores[winner] + 1 });
      setCurrentWinner(winner);
    }

    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setCurrentWinner(null);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0 });
    resetGame();
  };

  const styles = {
    container: {
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#1a1a1a',
      color: '#00ffcc',
      minHeight: '100vh',
      padding: '20px 0',
    },
    title: {
      fontSize: '2.5rem',
      textShadow: '0 0 10px #00ffcc, 0 0 20px #00ffcc',
    },
    scores: {
      fontSize: '1.2rem',
      margin: '10px 0',
    },
    board: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 100px)',
      gap: '10px',
      justifyContent: 'center',
      marginTop: '20px',
    },
    cell: {
      width: '100px',
      height: '100px',
      backgroundColor: '#333',
      color: '#00ffcc',
      fontSize: '2rem',
      fontWeight: 'bold',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid #00ffcc',
      cursor: 'pointer',
      textShadow: '0 0 5px #00ffcc',
    },
    winner: {
      fontSize: '1.5rem',
      margin: '20px 0',
      textShadow: '0 0 10px #00ffcc, 0 0 20px #00ffcc',
    },
    buttons: {
      marginTop: '20px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '1rem',
      margin: '0 10px',
      cursor: 'pointer',
      borderRadius: '5px',
      border: 'none',
      background: 'linear-gradient(45deg, #00ffcc, #0099cc)',
      color: 'black',
      textShadow: '0 0 5px #000',
      boxShadow: '0 0 10px #00ffcc, 0 0 20px #0099cc',
      transition: 'transform 0.2s ease-in-out',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tic-Tac-Toe</h1>
      <div style={styles.scores}>
        <p>Player X: {scores.X}</p>
        <p>Player O: {scores.O}</p>
      </div>
      <div style={styles.board}>
        {board.map((cell, index) => (
          <div
            key={index}
            style={styles.cell}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      {currentWinner && <h2 style={styles.winner}>Winner: {currentWinner}</h2>}
      <div style={styles.buttons}>
        <button style={styles.button} onClick={resetGame}>Reset Game</button>
        <button style={styles.button} onClick={resetScores}>Reset Scores</button>
      </div>
    </div>
  );
};

export default XO;
