type Props = {
  score: number;
  onRestart: () => void;
};

export function ResultScreen({ score, onRestart }: Props) {
  return (
    <div className="container">
      <h1>Score: {score}</h1>
      <div>
        
      </div>
      <button onClick={onRestart}>Play again</button>
    </div>
  );
}
