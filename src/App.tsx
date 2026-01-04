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

  // 🔒 Persisted end time (fixes spam bug)
  const endTimeRef = useRef<number | null>(null);
  // 🔒 Track if last card was added
  const lastCardAddedRef = useRef(false);

  /* ---------------- Countdown (3 → 2 → 1) ---------------- */
  useEffect(() => {
    if (countdown === null) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  /* ---------------- Game timer (60s) ---------------- */
  useEffect(() => {
    if (status !== "playing") return;
    if (countdown !== null) return;

    // Initialize end time ONCE
    if (endTimeRef.current === null) {
      endTimeRef.current = Date.now() + GAME_DURATION * 1000;
    }

    const interval = setInterval(() => {
      const remainingMs = endTimeRef.current! - Date.now();

      if (remainingMs <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setStatus("finished");
        return;
      }

      // full seconds only
      setTimeLeft(Math.ceil(remainingMs / 1000));
    }, 250); // small tick ensures smooth countdown

    return () => clearInterval(interval);
  }, [status, countdown]);

  /* ---------------- Add last card once when game finishes ---------------- */
  useEffect(() => {
    if (status !== "finished") return;
    if (lastCardAddedRef.current) return;

    const currentWord = cards[index];
    if (!currentWord) return;

    setGuesses((g) => {
      if (g.some((x) => x.word === currentWord)) return g;
      return [...g, { word: currentWord, correct: false }];
    });

    lastCardAddedRef.current = true;
  }, [status, cards, index]);

  /* ---------------- Start game ---------------- */
  const startGame = (deck: Deck) => {
    if (!deck.cards.length) return;

    endTimeRef.current = null;
    lastCardAddedRef.current = false;

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
          lastCardAddedRef.current = false;
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
          lastCardAddedRef.current = false;
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
