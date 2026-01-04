export type Deck = {
  id: string;
  name: string;
  cards: string[];
};

export type GameStatus = "idle" | "playing" | "finished";
