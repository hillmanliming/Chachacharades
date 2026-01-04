type Props = {
  card: string;
  timeLeft: number;
  onCorrect: () => void;
  onPass: () => void;
};

export function GameScreen({ card, timeLeft, onCorrect, onPass }: Props) {
  return (
    <div className="screen landscape">
      <div className="timer">{timeLeft}s</div>
      <div className="card">{card}</div>

      <div className="controls">
        <button onClick={onPass}>Pass</button>
        <button onClick={onCorrect}>Correct</button>
      </div>
    </div>
  );
}
