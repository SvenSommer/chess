import { Board, loadImages } from './models/board.js';

async function initializeGame() {
  const images = await loadImages();
  Board.initializeBoard();
  const board = new Board(images);
  board.createGraphicalBoard();
}

initializeGame();
