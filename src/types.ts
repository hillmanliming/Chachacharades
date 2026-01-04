export type Deck = {
  id: string;
  name: string;
  cards: string[];
};

export type GameState = "idle" | "playing" | "finished";
