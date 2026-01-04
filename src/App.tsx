import { useEffect, useState } from "react";
import { decks } from "./data/decks";
import { shuffle } from "./utils/shuffle";
import type { Deck, Guess } from "./types";
import { DeckLibrary } from "./components/DeckLibrary";
import { GameScreen } from "./components/GameScreen";
import { ResultScreen } from "./components/ResultScreen";

const GAME_DURATION = 60;

export default function App() {
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (status !== "playing") return;
    if (countdown !== null) return; // WAIT for countdown

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setStatus("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, countdown]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 1) {
      // After showing 1 for 1 second, end countdown
      const timer = setTimeout(() => setCountdown(null), 1000);
      return () => clearTimeout(timer);
    }

    // Normal countdown decrement for 3 → 2
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);
  const startGame = (deck: Deck) => {
    if (deck.cards.length === 0) return;
    setSelectedDeck(deck);
    setCards(shuffle(deck.cards));
    setGuesses([]);
    setIndex(0);
    setTimeLeft(GAME_DURATION);
    setCountdown(3); // start countdown
    setStatus("playing");
  };

  const handleGuess = (correct: boolean) => {
    setGuesses((g) => [...g, { word: cards[index], correct }]);

    // If this was the last card, finish the game
    if (index + 1 >= cards.length) {
      setStatus("finished");
    } else {
      setIndex((i) => i + 1);
    }
  };
  if (status === "idle") {
    return <DeckLibrary decks={decks} onSelect={startGame} />;
  }

  if (status === "playing") {
    if (!selectedDeck) return null;

    if (countdown !== null) {
      return (
        <div className="screen">
          <h1>Get Ready!</h1>
          <div className="countdown">{countdown}</div>
        </div>
      );
    }

    return (
      <GameScreen
        card={cards[index]}
        timeLeft={timeLeft}
        onCorrect={() => handleGuess(true)}
        onPass={() => handleGuess(false)}
      />
    );
  }
  if (status === "finished") {
    return (
      <ResultScreen
        guesses={guesses}
        onBackToLibrary={() => {
          setSelectedDeck(null);
          setGuesses([]);
          setCards([]);
          setIndex(0);
          setTimeLeft(GAME_DURATION);
          setStatus("idle");
        }}
        onPlayAgain={() => {
          if (!selectedDeck) return;

          // Restart the same deck
          setCards(shuffle(selectedDeck.cards)); // reshuffle
          setGuesses([]);
          setIndex(0);
          setTimeLeft(GAME_DURATION);
          setCountdown(3); // trigger 3s countdown
          setStatus("playing"); // ensure status is "playing"
        }}
      />
    );
  }

  return null;
}
