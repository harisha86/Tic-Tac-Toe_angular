export type Player = 'X' | 'O';
export type Cell = Player | null;
export type GameDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface GameState {
  board: Cell[];
  currentPlayer: Player;
  winner: Player | 'Draw' | null;
  difficulty: GameDifficulty;
}