import { Board } from './models/board.js';
import { loadImages } from './helper/imageLoader.js';

async function initializeGame() {
  const images = await loadImages();
  Board.initializeBoard();
  const board = new Board(images);
  board.createGraphicalBoard();
}

initializeGame();
