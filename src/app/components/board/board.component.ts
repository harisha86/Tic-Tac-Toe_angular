import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Cell, GameDifficulty } from '../../models/game.model';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-container">
      <h1>Tic Tac Toe</h1>
      
      <div class="difficulty-selector">
        <label>Difficulty:</label>
        <select (change)="onDifficultyChange($event)" [value]="(gameService.gameState$ | async)?.difficulty">
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div class="board">
        @for (cell of (gameService.gameState$ | async)?.board; track $index) {
          <div 
            class="cell" 
            [class.x]="cell === 'X'"
            [class.o]="cell === 'O'"
            (click)="makeMove($index)"
          >
            {{cell}}
          </div>
        }
      </div>

      @if ((gameService.gameState$ | async)?.winner) {
        <div class="game-over">
          @if ((gameService.gameState$ | async)?.winner === 'Draw') {
            <h2>It's a Draw!</h2>
          } @else {
            <h2>Player {{(gameService.gameState$ | async)?.winner}} Wins!</h2>
          }
          <button (click)="resetGame()">Play Again</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }

    .difficulty-selector {
      margin: 20px 0;
    }

    .difficulty-selector select {
      margin-left: 10px;
      padding: 5px;
      font-size: 16px;
    }

    .board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
      background-color: #34495e;
      padding: 5px;
      border-radius: 10px;
    }

    .cell {
      width: 100px;
      height: 100px;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s;
      border-radius: 5px;
    }

    .cell:hover {
      background-color: #f0f0f0;
    }

    .cell.x {
      color: #e74c3c;
    }

    .cell.o {
      color: #3498db;
    }

    .game-over {
      margin-top: 20px;
      text-align: center;
    }

    button {
      padding: 10px 20px;
      font-size: 16px;
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #27ae60;
    }
  `]
})
export class BoardComponent {
  constructor(public gameService: GameService) {}

  makeMove(index: number): void {
    this.gameService.makeMove(index);
  }

  onDifficultyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.gameService.setDifficulty(select.value as GameDifficulty);
    this.gameService.resetGame();
  }

  resetGame(): void {
    this.gameService.resetGame();
  }
}