import type { Guess } from "../types";

type Props = {
  guesses: Guess[];
  onBackToLibrary: () => void;
  onPlayAgain: () => void;
};

export function ResultScreen({ guesses, onBackToLibrary, onPlayAgain }: Props) {
  return (
    <div className="screen">
      <h1>Results</h1>

      <ul className="results">
        {guesses.map((g, i) => (
          <li key={i} className={g.correct ? "correct" : "incorrect"}>
            {g.word}
          </li>
        ))}
      </ul>

      <div className="result-buttons">
        <button onClick={onBackToLibrary}>Back to Library</button>
        <button onClick={onPlayAgain}>Play Again</button>
      </div>
    </div>
  );
}
