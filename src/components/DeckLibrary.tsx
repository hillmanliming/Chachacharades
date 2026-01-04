import type { Deck } from "../types";

type Props = {
  decks: Deck[];
  onSelect: (deck: Deck) => void;
};

export function DeckLibrary({ decks, onSelect }: Props) {
  return (
    <div className="screen">
      <h1>Your decks</h1>
      <ul className="deck-list">
        {decks.map((deck) => (
          <li key={deck.id}>
            <article onClick={() => onSelect(deck)}>
              <span className="emoji">{deck.emoji}</span>
              <span>{deck.name}</span>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
