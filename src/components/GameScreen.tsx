type Props = {
  card: string;
  timeLeft: number;
  onCorrect: () => void;
  onPass: () => void;
};

export function GameScreen({ card, timeLeft, onCorrect, onPass }: Props) {
  return (
    <div className="container">
      <h2>{timeLeft}s</h2>
      <h1>{card}</h1>

      <div>
        <button onClick={onPass}>✖</button>
        <button onClick={onCorrect}>✔</button>
      </div>
    </div>
  );
}
