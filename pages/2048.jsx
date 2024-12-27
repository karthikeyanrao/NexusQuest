import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // For navigation

const getInitialGrid = () => {
  const grid = Array(4)
    .fill(null)
    .map(() => Array(4).fill(null));
  addRandomNumber(grid);
  addRandomNumber(grid);
  return grid;
};

const addRandomNumber = (grid) => {
  const emptyCells = [];
  grid.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell === null) emptyCells.push([i, j]);
    })
  );

  if (emptyCells.length > 0) {
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
};

const Game2048 = () => {
  const [isClient, setIsClient] = useState(false);
  const [grid, setGrid] = useState(getInitialGrid());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
      );
  const [gameOver, setGameOver] = useState(false);
  const router = useRouter(); // To navigate on exit

  useEffect(() => {
    setIsClient(true); // Set to true once component is mounted
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedHighScore = parseInt(localStorage.getItem("2048-highScore"), 10);
      setHighScore(storedHighScore || 0); 
      setGrid(getInitialGrid());// Set high score from localStorage if available
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("2048-highScore", highScore);
    }
  }, [highScore, isClient]);

  const exitGame = () => {
    if (isClient) {
      const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
      leaderboard.push({ name: "You", score });
      leaderboard.sort((a, b) => b.score - a.score);
      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
      localStorage.setItem("score", score);
      router.push("/leaderboard");
    }
  };

  const handleKeyDown = (e) => {
    if (!grid || gameOver) return;
 // Prevent default scrolling behavior for ArrowUp and ArrowDown keys
 if (e.key === "ArrowUp" || e.key === "ArrowDown") {
  e.preventDefault();
}
    let newGrid;
    let scoreChange = 0;

    const move = {
      ArrowLeft: moveLeft,
      ArrowRight: moveRight,
      ArrowUp: moveUp,
      ArrowDown: moveDown,
    }[e.key];

    if (move) {
      ({ newGrid, scoreChange } = move(grid));
      if (newGrid) {
        addRandomNumber(newGrid);
        setGrid(newGrid);
        setScore((prev) => prev + scoreChange);

        if (score + scoreChange > highScore) {
          setHighScore(score + scoreChange);
        }

        if (!canMove(newGrid)) {
          setGameOver(true);
        }
      }
    }
  };

  const moveLeft = (grid) => {
    let scoreChange = 0;
    const newGrid = grid.map((row) => {
      const { combinedRow, scoreChange: rowScore } = combineRow(row);
      scoreChange += rowScore;
      return combinedRow;
    });
    return { newGrid, scoreChange };
  };

  const moveRight = (grid) => {
    let scoreChange = 0;
    const newGrid = grid.map((row) => {
      const { combinedRow, scoreChange: rowScore } = combineRow(row.slice().reverse());
      scoreChange += rowScore;
      return combinedRow.reverse();
    });
    return { newGrid, scoreChange };
  };

  const moveUp = (grid) => {
    const transposed = transpose(grid);
    let scoreChange = 0;
    const newGrid = transpose(
      transposed.map((row) => {
        const { combinedRow, scoreChange: rowScore } = combineRow(row);
        scoreChange += rowScore;
        return combinedRow;
      })
    );
    return { newGrid, scoreChange };
  };

  const moveDown = (grid) => {
    const transposed = transpose(grid);
    let scoreChange = 0;
    const newGrid = transpose(
      transposed.map((row) => {
        const { combinedRow, scoreChange: rowScore } = combineRow(row.slice().reverse());
        scoreChange += rowScore;
        return combinedRow.reverse();
      })
    );
    return { newGrid, scoreChange };
  };

  const combineRow = (row) => {
    const newRow = row.filter((num) => num !== null);
    let scoreChange = 0;

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        scoreChange += newRow[i];
        newRow[i + 1] = null;
      }
    }

    const filteredRow = newRow.filter((num) => num !== null);
    return { combinedRow: filteredRow.concat(Array(4 - filteredRow.length).fill(null)), scoreChange };
  };

  const transpose = (grid) => grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]));

  const canMove = (grid) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === null) return true;
        if (i < 3 && grid[i][j] === grid[i + 1][j]) return true;
        if (j < 3 && grid[i][j] === grid[i][j + 1]) return true;
      }
    }
    return false;
  };

  const resetGame = () => {
    setGrid(getInitialGrid());
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [grid, gameOver]);

 
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#1c1c1c", // Dark background
      color: "#fff",
      flexDirection: "column",
      position: "relative",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      zIndex: 10,
      color: "#ffcc00",
    },
    button: {
      padding: "12px 25px",
      backgroundColor: "#ffcc00",
      color: "#333",
      border: "none",
      borderRadius: "8px",
      margin: "10px",
      cursor: "pointer",
      fontSize: "1rem",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      transition: "transform 0.2s ease-in-out",
    },
    buttonContainer: {
      display: "flex",
      gap: "20px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 80px)",
      gap: "10px",
      marginTop: "20px",
    },
    cell: {
      width: "80px",
      height: "80px",
      backgroundColor: "#333",
      color: "#ffcc00",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1.5rem",
      fontWeight: "bold",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: "3rem", color: "#ffcc00" }}>2048 Game</h1>
      <div style={{ fontSize: "1.5rem" }}>Score: {score}</div>
      <div style={{ fontSize: "1.5rem" }}>High Score: {highScore}</div>
      <div style={styles.grid}>
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div key={`${i}-${j}`} style={styles.cell}>
              {cell}
            </div>
          ))
        )}
      </div>

      {gameOver && (
        <div style={styles.overlay}>
          <h2>Game Over</h2>
          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={resetGame}>
              Restart
            </button>
            <button style={styles.button} onClick={exitGame}>
              Exit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Game2048;