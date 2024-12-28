  import React, { useState, useEffect, useCallback } from "react";
  import { useRouter } from "next/router";

  const Floppy = () => {
    const gameHeight = 500;
    const gameWidth = 800;
    const birdSize = 50;
    const obstacleWidth = 70;
    const jumpHeight = 70;
    const gravity = 5;

    const [birdPosition, setBirdPosition] = useState(gameHeight / 2);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [obstaclePosition, setObstaclePosition] = useState(gameWidth);
    const [obstacleHeight, setObstacleHeight] = useState(150);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);

    const router = useRouter();

    // Handle bird falling due to gravity
    useEffect(() => {
      if (!isGameRunning) return;

      const gravityInterval = setInterval(() => {
        setBirdPosition((prev) =>
          Math.min(prev + gravity, gameHeight - birdSize)
        );
      }, 30);

      return () => clearInterval(gravityInterval);
    }, [isGameRunning]);

    // Handle obstacle movement
    useEffect(() => {
      if (!isGameRunning) return;

      const obstacleInterval = setInterval(() => {
        setObstaclePosition((prev) => {
          if (prev <= 0) {
            setScore((prevScore) => prevScore + 1);
            setObstacleHeight(Math.floor(Math.random() * (gameHeight - 200)));
            return gameWidth - obstacleWidth;
          }
          return prev - 10;
        });
      }, 30);

      return () => clearInterval(obstacleInterval);
    }, [isGameRunning]);

    // Collision detection
    useEffect(() => {
      const birdBottom = birdPosition + birdSize;
      const obstacleTop = obstacleHeight;
      const obstacleBottom = obstacleHeight + 200;

      const isCollided =
        birdBottom > gameHeight ||
        (obstaclePosition < 100 &&
          obstaclePosition + obstacleWidth > 50 &&
          (birdPosition < obstacleTop || birdBottom > obstacleBottom));

      if (isCollided) {
        setIsGameRunning(false);
        setHighScore((prevHighScore) => Math.max(prevHighScore, score));
        setIsGameOver(true);
      }
    }, [birdPosition, obstaclePosition, obstacleHeight, score]);

    // Jump functionality using the `spacebar`
    const handleKeyUp = useCallback(
      (e) => {
        if (e.code === "Space" && isGameRunning) {
          setBirdPosition((prev) => Math.max(prev - jumpHeight, 0));
        }
      },
      [isGameRunning]
    );

    useEffect(() => {
      window.addEventListener("keyup", handleKeyUp);
      return () => window.removeEventListener("keyup", handleKeyUp);
    }, [handleKeyUp]);

    const resetGame = useCallback(() => {
      setBirdPosition(gameHeight / 2);
      setObstaclePosition(gameWidth);
      setObstacleHeight(150);
      setScore(0);
      setIsGameOver(false);
      setIsGameRunning(false);
    }, []);

    const startGame = () => {
    
      setIsGameRunning(true);
      setScore(0);
      setIsGameOver(false);
    };
    const exitGame = () => {
      // Fetch existing leaderboard or initialize with an empty array
      let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    
      // Add a new entry for the current game
      leaderboard.push({ name: "Karthikeyan", score });
    
      // Sort leaderboard in descending order of scores
      leaderboard.sort((a, b) => b.score - a.score);
    
      // Save updated leaderboard back to localStorage
      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    
      // Also save the score separately
      localStorage.setItem("score", score);
    
      // Log to verify the updated leaderboard
      console.log("Updated leaderboard:", leaderboard);
    
      // Navigate to the leaderboard page
      router.push("/leaderboard");
    };
    
    
    

    return (
      <div
        style={{
          height: gameHeight,
          width: gameWidth,
          background: "skyblue",
          overflow: "hidden",
          position: "relative",
          border: "2px solid black",
          margin: "50px auto",
        }}
      >
        {/* Bird */}
        <div
          style={{
            height: birdSize,
            width: birdSize+10,
            backgroundImage: `url(.//images/bird.png)`,
            backgroundSize: "cover",
            position: "absolute",
            top: birdPosition,
            left: 50,
          }}
        ></div>

        {/* Top Obstacle */}
        <div
          style={{
            position: "absolute",
            top: -7,
            left: obstaclePosition,
            height: obstacleHeight,
            width: obstacleWidth+20,
            backgroundImage: `url(.//images/pipet.png)`,
            backgroundSize: "cover",
          }}
        ></div>

        {/* Bottom Obstacle */}
        <div
          style={{
            position: "absolute",
            top: obstacleHeight + 200,
            left: obstaclePosition,
            height: gameHeight - (obstacleHeight + 200),
            width: obstacleWidth,
            backgroundImage: `url(.//images/pipe.png)`,
            backgroundSize: "cover",
          }}
        ></div>

        {/* High Score */}
        <h1
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            color: "white",
            fontSize: "20px",
            zIndex: 100,
          }}
        >
          High Score: {highScore}
        </h1>

        {/* Current Score */}
        <h1
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: "20px",
            zIndex: 100,
          }}
        >
          Score: {score}
        </h1>

        {/* Game Over Box */}
        {isGameOver && (
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "black",
              border: "2px solid black",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <h2>Game Over!</h2>
            <p>Your Score: {score}</p>
            <p>High Score: {highScore}</p>
            <button
              onClick={resetGame}
              style={{
                margin: "10px",
                padding: "10px 20px",
                fontSize: "18px",
                background: "black",
                border: "2px solid white",
                cursor: "pointer",
              }}
            >
              Restart
            </button>
            <button
              onClick={exitGame}
              style={{
                margin: "10px",
                padding: "10px 20px",
                fontSize: "18px",
                background: "black",
                border: "2px solid white",
                cursor: "pointer",
              }}
            >
              Exit
            </button>
          </div>
        )}

        {/* Start Button */}
        {!isGameRunning && !isGameOver && (
          <button
            onClick={startGame}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "10px 20px",
              fontSize: "18px",
              background: "white",
              border: "2px solid black",
              cursor: "pointer",
              color: "black",
            }}
          >
            Start
          </button>
        )}
      </div>
    );
  };

  export default Floppy;
