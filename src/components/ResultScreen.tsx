import type { Guess } from "../types";

type Props = {
  guesses: Guess[];
  onBackToLibrary: () => void;
  onPlayAgain: () => void;
};

export function ResultScreen({ guesses, onBackToLibrary, onPlayAgain }: Props) {
  const score = guesses.filter((g) => g.correct).length;

  return (
    <div className="screen game-screen">
      <header>
        <h1>Score: {score}</h1>
      </header>

      <ul className="results">
        {guesses.map((g, i) => (
          <li key={i} className={g.correct ? "correct" : "incorrect"}>
            {g.word}
          </li>
        ))}
      </ul>

      <footer className="controls">
        <button onClick={onBackToLibrary}>Home</button>
        <button onClick={onPlayAgain}>Play Again</button>
      </footer>
    </div>
  );
}
