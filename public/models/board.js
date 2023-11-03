//import { BoardEventHandler } from "../helper/boardEventHandler.js";
import { FENParser } from "../controller/fenParser.js";
import { Piece } from "./piece.js";

const SQUARE_SIZE = 75;
const LIGHT_SQUARE_COLOR = '#F0D9B5';
const DARK_SQUARE_COLOR = '#B58863';

export class Render {
    constructor(context, images, squareSize) {
        this.ctx = context;
        this.images = images;
        this.squareSize = squareSize;
    }

    drawPieceAtPosition(piece, x, y) {
        const imageName = Piece.pieceMapping[piece];
        const image = this.images[imageName];
        if (image) {
            this.ctx.drawImage(image, x, y, this.squareSize, this.squareSize);
        } else {
            console.error(`Image not found: ${imageName}`);
        }
    }

    drawSquare(color, x, y) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
    }

    drawPiece(file, rank) {
        const pieceCode = Board.Square[file + rank * 8];
        if (pieceCode) {
            this.drawPieceAtPosition(pieceCode, file * this.squareSize, rank * this.squareSize);
        }
    }

    createGraphicalBoard() {
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                const isLightSquare = (file + rank) % 2 === 0;
                const squareColor = isLightSquare ? LIGHT_SQUARE_COLOR : DARK_SQUARE_COLOR;
                this.drawSquare(squareColor, file, rank);
                this.drawPiece(file, rank);
            }
        }
    }
}

export class BoardEventHandler {
    constructor(board) {
        this.board = board;
        this.selectedPiece = null;
        this.offsetX = 0;
        this.offsetY = 0;

        this.board.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.board.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.board.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    getMousePos(evt) {
        const rect = this.board.canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    handleMouseDown(evt) {
        const mousePos = this.getMousePos(evt);
        const file = Math.floor(mousePos.x / this.board.squareSize);
        const rank = Math.floor(mousePos.y / this.board.squareSize);
        const piece = Board.Square[file + rank * 8];

        if (piece) {
            this.selectedPiece = {
                piece,
                file,
                rank
            };
            this.offsetX = mousePos.x - file * this.board.squareSize;
            this.offsetY = mousePos.y - rank * this.board.squareSize;
            Board.Square[file + rank * 8] = null;
            this.board.render.createGraphicalBoard();
            this.board.render.drawPieceAtPosition(piece, mousePos.x - this.offsetX, mousePos.y - this.offsetY);
        }
    }

    handleMouseMove(evt) {
        if (this.selectedPiece) {
            const mousePos = this.getMousePos(evt);
            const x = mousePos.x - this.offsetX;
            const y = mousePos.y - this.offsetY;
            this.board.render.createGraphicalBoard();
            this.board.render.drawPieceAtPosition(this.selectedPiece.piece, x, y);
        }
    }

    handleMouseUp(evt) {
        if (this.selectedPiece) {
            const mousePos = this.getMousePos(evt);
            const file = Math.floor(mousePos.x / this.board.squareSize);
            const rank = Math.floor(mousePos.y / this.board.squareSize);
            const targetIndex = file + rank * 8;
            const targetPiece = Board.Square[targetIndex];

            if (targetPiece !== null && (targetPiece & Piece.ColorMask) !== (this.selectedPiece.piece & Piece.ColorMask)) {
                Board.Square[targetIndex] = null;
            }

            Board.Square[targetIndex] = this.selectedPiece.piece;
            this.selectedPiece = null;
            this.board.render.createGraphicalBoard();
        }
    }
}

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
