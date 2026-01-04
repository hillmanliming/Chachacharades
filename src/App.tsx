import { useEffect, useState } from "react";
import { defaultDeck } from "./data/animalsDeck";
import type { GameState } from "./types";

const GAME_DURATION = 60;

function App() {
  const [status, setStatus] = useState<GameState>("idle");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (status !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setStatus("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const startGame = () => {
    setStatus("playing");
    setTimeLeft(GAME_DURATION);
    setIndex(0);
    setScore(0);
  };

  const nextCard = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setIndex((i) => i + 1);
  };

  if (status === "idle") {
    return <button onClick={startGame}>Start</button>;
  }

  if (status === "finished") {
    return (
      <>
        <h1>Score: {score}</h1>
        <button onClick={startGame}>Play again</button>
      </>
    );
  }

  return (
    <>
      <h2>{timeLeft}s</h2>
      <h1>{defaultDeck.cards[index]}</h1>
      <button onClick={() => nextCard(true)}>✔</button>
      <button onClick={() => nextCard(false)}>✖</button>
    </>
  );
}

export default App;
