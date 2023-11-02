import { Piece } from "./piece.js";

const SQUARE_SIZE = 75;
const LIGHT_SQUARE_COLOR = '#F0D9B5';
const DARK_SQUARE_COLOR = '#B58863';

export class Board {
    static pieceMapping = {
        [Piece.White | Piece.Bishop]: 'lb',
        [Piece.White | Piece.King]: 'lk',
        [Piece.White | Piece.Knight]: 'ln',
        [Piece.White | Piece.Pawn]: 'lp',
        [Piece.White | Piece.Queen]: 'lq',
        [Piece.White | Piece.Rook]: 'lr',
        [Piece.Black | Piece.Bishop]: 'db',
        [Piece.Black | Piece.King]: 'dk',
        [Piece.Black | Piece.Knight]: 'dn',
        [Piece.Black | Piece.Pawn]: 'dp',
        [Piece.Black | Piece.Queen]: 'dq',
        [Piece.Black | Piece.Rook]: 'dr',
    };

    static Square = new Array(64);

    static initializeBoard() {
        Board.Square[0] = Piece.White | Piece.Bishop;
        Board.Square[63] = Piece.Black | Piece.Queen;
        Board.Square[7] = Piece.Black | Piece.Knight;
    }

   constructor(images) {
        this.images = images;
        this.canvas = document.getElementById('chessBoard');
        this.ctx = this.canvas.getContext('2d');
        this.squareSize = SQUARE_SIZE;
    }

    drawSquare(color, x, y) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
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

    drawPiece(file, rank) {
        const pieceCode = Board.Square[file + rank * 8];
        if (pieceCode) {
            const imageName = Board.pieceMapping[pieceCode];
            const image = this.images[imageName];
            if (image) {
                this.ctx.drawImage(image, file * this.squareSize, rank * this.squareSize, this.squareSize, this.squareSize);
            } else {
                console.error(`Image not found: ${imageName}`);
            }
        }
    }
}
