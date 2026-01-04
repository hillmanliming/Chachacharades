import { useEffect, useState } from "react";
import { decks } from "./data/decks";
import { shuffle } from "./utils/shuffle";
import type { Deck, Guess } from "./types";
import { DeckLibrary } from "./components/DeckLibrary";
import { GameScreen } from "./components/GameScreen";
import { ResultScreen } from "./components/ResultScreen";

const GAME_DURATION = 60; // in seconds

export default function App() {
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [countdown, setCountdown] = useState<number | null>(3);

  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Game timer
  useEffect(() => {
    if (status !== "playing" || countdown !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          // Mark current card as incorrect if not guessed
          setGuesses((g) => {
            const currentWord = cards[index];
            if (g.some((x) => x.word === currentWord)) return g;
            return [...g, { word: currentWord, correct: false }];
          });
          setStatus("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, countdown, cards, index]);

  const startGame = (deck: Deck) => {
    if (!deck.cards.length) return;
    setSelectedDeck(deck);
    setCards(shuffle(deck.cards));
    setGuesses([]);
    setIndex(0);
    setTimeLeft(GAME_DURATION);
    setCountdown(3);
    setStatus("playing");
  };

  const handleGuess = (correct: boolean) => {
    setGuesses((g) => [...g, { word: cards[index], correct }]);
    setIndex((i) => (i + 1 >= cards.length ? i : i + 1));
    if (index + 1 >= cards.length) setStatus("finished");
  };

  if (status === "idle")
    return <DeckLibrary decks={decks} onSelect={startGame} />;

  if (status === "playing" && selectedDeck)
    return (
      <GameScreen
        card={cards[index]}
        timeLeft={timeLeft}
        countdown={countdown ?? undefined}
        onCorrect={() => handleGuess(true)}
        onPass={() => handleGuess(false)}
      />
    );

  if (status === "finished")
    return (
      <ResultScreen
        guesses={guesses}
        onBackToLibrary={() => {
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
          setCards(shuffle(selectedDeck.cards));
          setGuesses([]);
          setIndex(0);
          setTimeLeft(GAME_DURATION);
          setCountdown(3);
          setStatus("playing");
        }}
      />
    );

  return null;
}
