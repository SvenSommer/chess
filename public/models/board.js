import { FENParser } from "../controller/fenParser.js";
import { BoardEventHandler } from "../controller/boardEventHandler.js";
import { Render } from "../controller/renderer.js";

const SQUARE_SIZE = 75;
const STARTING_POSITION_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export class Board {
    constructor(images) {
        this.images = images;
        this.canvas = document.getElementById('chessBoard');
        this.ctx = this.canvas.getContext('2d');
        this.squareSize = SQUARE_SIZE;

        this.squares = FENParser.parseFEN(STARTING_POSITION_FEN);
        this.render = new Render(this.ctx, images, SQUARE_SIZE);
        this.eventHandler = new BoardEventHandler(this.canvas, this.squareSize, this.squares, this.render);
        
        this.render.createGraphicalBoard(this.squares);
    }
}


     

