import { useEffect, useState } from "react";
import { defaultDeck } from "./data/animalsDeck";
import type { GameStatus } from "./types";

import { StartScreen } from "./components/StartScreen";
import { GameScreen } from "./components/GameScreen";
import { ResultScreen } from "./components/ResultScreen";
import { shuffle } from "./utils/shuffle";

const GAME_DURATION = 60;

function App() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState<string[]>([]);

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

  useEffect(() => {
    if (status === "playing" && index >= cards.length) {
      setStatus("finished");
    }
  }, [index, status, cards.length]);

  const startGame = () => {
    setCards(shuffle(defaultDeck.cards));
    setStatus("playing");
    setTimeLeft(GAME_DURATION);
    setIndex(0);
    setScore(0);
  };

  const handleCorrect = () => {
    setScore((s) => s + 1);
    setIndex((i) => i + 1);
  };

  const handlePass = () => {
    setIndex((i) => i + 1);
  };

  if (status === "idle") {
    return <StartScreen onStart={startGame} />;
  }

  if (status === "finished") {
    return <ResultScreen score={score} onRestart={startGame} />;
  }

  return (
    <GameScreen
      card={cards[index]}
      timeLeft={timeLeft}
      onCorrect={handleCorrect}
      onPass={handlePass}
    />
  );
}

export default App;
