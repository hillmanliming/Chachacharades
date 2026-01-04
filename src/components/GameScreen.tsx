type Props = {
  card: string;
  timeLeft: number;
  countdown?: number; // optional countdown
  onCorrect: () => void;
  onPass: () => void;
};

export function GameScreen({
  card,
  timeLeft,
  countdown,
  onCorrect,
  onPass,
}: Props) {
  return (
    <div className="screen game-screen">
      {/* Timer: always takes space, hidden visually during countdown */}
      <div
        className="timer"
        style={{ opacity: countdown !== undefined ? 0 : 1 }}
      >
        {timeLeft}
      </div>

      {/* Card / Countdown */}
      <h1 className="card">
        {countdown !== undefined ? (
          <div className="flex column">
            <h1>Get ready</h1>
            <h1 >{countdown}</h1>
          </div>
        ) : (
          card
        )}
      </h1>
      {/* Controls */}
      <div
        className="controls"
        style={{ opacity: countdown !== undefined ? 0 : 1 }}
      >
        <button onClick={onPass}>Pass</button>
        <button onClick={onCorrect}>Correct</button>
      </div>
    </div>
  );
}
