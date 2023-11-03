import { FENParser } from "../controller/fenParser.js";
import { BoardEventHandler } from "../helper/BoardEventHandler.js";
import { Render } from "../controller/renderer.js";

const SQUARE_SIZE = 75;

export class Board {
    constructor(images) {
        this.images = images;
        this.canvas = document.getElementById('chessBoard');
        this.ctx = this.canvas.getContext('2d');
        this.squareSize = SQUARE_SIZE;
        new BoardEventHandler(this);
        this.fenParser = new FENParser(this);
        this.render = new Render(this.ctx, images, SQUARE_SIZE);
        this.initializeBoard();
    }

    static Square = new Array(64);


    initializeBoard() {
        const startingPositionFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        this.fenParser.loadPositionFromFEN(startingPositionFEN);
        this.render.createGraphicalBoard();
      }

     
}
