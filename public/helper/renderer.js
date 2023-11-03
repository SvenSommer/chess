import { Board } from "../models/board.js";

export class Renderer {
    constructor(ctx, images, squareSize) {
        this.ctx = ctx;
        this.images = images;
        this.squareSize = squareSize;
    }

    drawSquare(color, x, y) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
    }

    drawPieceAtPosition(piece, x, y) {
        const imageName = Board.pieceMapping[piece];
        const image = this.images[imageName];
        if (image) {
            this.ctx.drawImage(image, x, y, this.squareSize, this.squareSize);
        } else {
            console.error(`Image not found: ${imageName}`);
        }
    }

    createGraphicalBoard(board) {
        console.log('Board in createGraphicalBoard:', board);
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                const isLightSquare = (file + rank) % 2 === 0;
                const squareColor = isLightSquare ? board.LIGHT_SQUARE_COLOR : board.DARK_SQUARE_COLOR;
                this.drawSquare(squareColor, file, rank);
                this.drawPiece(board, file, rank);
            }
        }
    }

    drawPiece(board, file, rank) {
        if (!Array.isArray(board.Square)) {
            console.error('board.Square is not an array:', board.Square);
            return;
        }
        if (file < 0 || file > 7 || rank < 0 || rank > 7) {
            console.error(`Invalid file or rank: file=${file}, rank=${rank}`);
            return;
        }
    
        const index = file + rank * 8;
        if (index >= board.Square.length) {
            console.error(`Index out of bounds: ${index}`);
            return;
        }
    
        const pieceCode = board.Square[index];
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
