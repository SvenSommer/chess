import { Board } from './models/board.js';
import { loadImages } from './helper/imageLoader.js';

async function initializeGame() {
  const images = await loadImages();
  const board = new Board(images);
}


initializeGame();
