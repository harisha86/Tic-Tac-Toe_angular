import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cell, GameState, Player, GameDifficulty } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private initialState: GameState = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    difficulty: 'Easy'
  };

  private gameStateSubject = new BehaviorSubject<GameState>(this.initialState);
  gameState$ = this.gameStateSubject.asObservable();

  private winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  makeMove(index: number): void {
    const currentState = this.gameStateSubject.value;
    if (currentState.board[index] || currentState.winner) return;

    const newBoard = [...currentState.board];
    newBoard[index] = currentState.currentPlayer;

    const winner = this.checkWinner(newBoard);
    if (!winner) {
      this.gameStateSubject.next({
        ...currentState,
        board: newBoard,
        currentPlayer: 'O'
      });
      
      setTimeout(() => this.makeComputerMove(), 500);
    } else {
      this.gameStateSubject.next({
        ...currentState,
        board: newBoard,
        winner
      });
    }
  }

  private makeComputerMove(): void {
    const currentState = this.gameStateSubject.value;
    if (currentState.winner) return;

    const move = this.getBestMove(currentState.difficulty);
    const newBoard = [...currentState.board];
    newBoard[move] = 'O';

    const winner = this.checkWinner(newBoard);
    this.gameStateSubject.next({
      ...currentState,
      board: newBoard,
      currentPlayer: 'X',
      winner: winner
    });
  }

  private getBestMove(difficulty: GameDifficulty): number {
    const currentState = this.gameStateSubject.value;
    const availableMoves = currentState.board
      .map((cell, index) => cell === null ? index : null)
      .filter((index): index is number => index !== null);

    switch (difficulty) {
      case 'Easy':
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      
      case 'Medium':
        return Math.random() > 0.5 ? 
          this.minimax(currentState.board, 'O', true).index : 
          availableMoves[Math.floor(Math.random() * availableMoves.length)];
      
      case 'Hard':
        return this.minimax(currentState.board, 'O', true).index;
      
      default:
        return availableMoves[0];
    }
  }

  private minimax(board: Cell[], player: Player, isMaximizing: boolean): { score: number; index: number } {
    const availableMoves = board
      .map((cell, index) => cell === null ? index : null)
      .filter((index): index is number => index !== null);

    if (this.checkWinner(board) === 'O') return { score: 1, index: -1 };
    if (this.checkWinner(board) === 'X') return { score: -1, index: -1 };
    if (availableMoves.length === 0) return { score: 0, index: -1 };

    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestMove = -1;

    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = player;

      const score = this.minimax(
        newBoard,
        player === 'O' ? 'X' : 'O',
        !isMaximizing
      ).score;

      if (isMaximizing && score > bestScore) {
        bestScore = score;
        bestMove = move;
      } else if (!isMaximizing && score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return { score: bestScore, index: bestMove };
  }

  private checkWinner(board: Cell[]): Player | 'Draw' | null {
    for (const [a, b, c] of this.winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return board.includes(null) ? null : 'Draw';
  }

  setDifficulty(difficulty: GameDifficulty): void {
    const currentState = this.gameStateSubject.value;
    this.gameStateSubject.next({
      ...currentState,
      difficulty
    });
  }

  resetGame(): void {
    const currentState = this.gameStateSubject.value;
    this.gameStateSubject.next({
      ...this.initialState,
      difficulty: currentState.difficulty
    });
  }
}