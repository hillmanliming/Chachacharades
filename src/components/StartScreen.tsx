type Props = {
  onStart: () => void;
};

export function StartScreen({ onStart }: Props) {
  return (
    <button className="button" onClick={onStart}>
      Start
    </button>
  );
}
