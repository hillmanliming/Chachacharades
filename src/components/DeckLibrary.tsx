import type { Deck } from "../types";

type Props = {
  decks: Deck[];
  onSelect: (deck: Deck) => void;
};

export function DeckLibrary({ decks, onSelect }: Props) {
  return (
    <div className="screen">
      <h1>Cha-Cha-Charades</h1>
      <ul className="deck-list">
        {decks.map((deck) => (
          <li key={deck.id}>
            <button onClick={() => onSelect(deck)}>{deck.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
