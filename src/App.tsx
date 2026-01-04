import { useEffect, useRef, useState } from "react";
import { decks } from "./data/decks";
import { shuffle } from "./utils/shuffle";
import type { Deck, Guess } from "./types";
import { DeckLibrary } from "./components/DeckLibrary";
import { GameScreen } from "./components/GameScreen";
import { ResultScreen } from "./components/ResultScreen";

const GAME_DURATION = 60; // seconds

export default function App() {
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [countdown, setCountdown] = useState<number | null>(3);

  // 🔒 Persisted end time
  const endTimeRef = useRef<number | null>(null);

  /* ---------------- Countdown (3 → 2 → 1) ---------------- */
  useEffect(() => {
    if (countdown === null) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  /* ---------------- Game timer ---------------- */
  useEffect(() => {
    if (status !== "playing") return;
    if (countdown !== null) return;

    if (endTimeRef.current === null) {
      endTimeRef.current = Date.now() + GAME_DURATION * 1000;
    }

    const interval = setInterval(() => {
      const remainingMs = endTimeRef.current! - Date.now();

      if (remainingMs <= 0) {
        clearInterval(interval);

        // ✅ ADD LAST SHOWN CARD AS WRONG (if not already guessed)
        setGuesses((g) => {
          const word = cards[index];
          if (!word) return g;
          if (g.length > index) return g; // already guessed
          return [...g, { word, correct: false }];
        });

        setTimeLeft(0);
        setStatus("finished");
        return;
      }

      setTimeLeft(Math.ceil(remainingMs / 1000));
    }, 250);

    return () => clearInterval(interval);
  }, [status, countdown, cards, index]);

  /* ---------------- Start game ---------------- */
  const startGame = (deck: Deck) => {
    if (!deck.cards.length) return;

    endTimeRef.current = null;

    setSelectedDeck(deck);
    setCards(shuffle(deck.cards));
    setGuesses([]);
    setIndex(0);
    setTimeLeft(GAME_DURATION);
    setCountdown(3);
    setStatus("playing");
  };

  /* ---------------- Guess handler ---------------- */
  const handleGuess = (correct: boolean) => {
    setGuesses((g) => [...g, { word: cards[index], correct }]);
    setIndex((i) => (i + 1 < cards.length ? i + 1 : i));

    if (index + 1 >= cards.length) {
      setStatus("finished");
    }
  };

  /* ---------------- Screens ---------------- */
  if (status === "idle") {
    return <DeckLibrary decks={decks} onSelect={startGame} />;
  }

  if (status === "playing" && selectedDeck) {
    return (
      <GameScreen
        card={cards[index]}
        timeLeft={timeLeft}
        countdown={countdown ?? undefined}
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
          endTimeRef.current = null;
          setSelectedDeck(null);
          setGuesses([]);
          setCards([]);
          setIndex(0);
          setTimeLeft(GAME_DURATION);
          setCountdown(3);
          setStatus("idle");
        }}
        onPlayAgain={() => {
          if (!selectedDeck) return;

          endTimeRef.current = null;
          setCards(shuffle(selectedDeck.cards));
          setGuesses([]);
          setIndex(0);
          setTimeLeft(GAME_DURATION);
          setCountdown(3);
          setStatus("playing");
        }}
      />
    );
  }

  return null;
}
