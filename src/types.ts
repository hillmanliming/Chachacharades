export type Deck = {
  id: string;
  name: string;
  cards: string[];
};

export type Guess = {
  word: string;
  correct: boolean;
};
