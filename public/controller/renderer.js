import { Piece } from "../models/piece.js";
import { Board } from "../models/board.js";

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

    drawPiece(squares, file, rank) {
        const pieceCode = squares[file + rank * 8];
        if (pieceCode) {
            this.drawPieceAtPosition(pieceCode, file * this.squareSize, rank * this.squareSize);
        }
    }

    createGraphicalBoard(squares) {
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                const isLightSquare = (file + rank) % 2 === 0;
                const squareColor = isLightSquare ? LIGHT_SQUARE_COLOR : DARK_SQUARE_COLOR; 
                this.drawSquare(squareColor, file, rank);
                this.drawPiece(squares, file, rank);
            }
        }
    }
}
