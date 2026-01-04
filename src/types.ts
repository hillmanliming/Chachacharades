export type Deck = {
  id: string;
  name: string;
  emoji: string;
  cards: string[];
};

export type Guess = {
  word: string;
  correct: boolean;
};
