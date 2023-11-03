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


    highlightMoves(moves) {
        moves.forEach(move => {
            const { file, rank, isCapture, coversFriendly } = move;
            this.drawHighlight(file, rank, isCapture, coversFriendly);
        });
    }
    
    drawHighlight(file, rank, isCapture, coversFriendly) {
        const x = file * this.squareSize;
        const y = rank * this.squareSize;
        let highlightFillColor, highlightBorderColor;
    
        // Determine the highlight color based on the move type
        if (isCapture) {
            highlightFillColor = 'rgba(255, 0, 0, 0.7)'; // Red for captures
            highlightBorderColor = 'darkred'; // Dark red for captures
        } else if (coversFriendly) {
            highlightFillColor = 'rgba(50, 205, 50, 0.7)'; // Green for covering friendly pieces
            highlightBorderColor = 'darkgreen'; // Dark green for covers
        } else {
            highlightFillColor = 'rgba(173, 216, 230, 0.7)'; // Light blue for normal moves
            highlightBorderColor = 'rgba(70, 130, 180, 0.9)'; // Darker blue for normal moves
        }
    
        // Draw the highlight fill
        this.ctx.fillStyle = highlightFillColor;
        this.ctx.fillRect(x, y, this.squareSize, this.squareSize);
    
        // Draw the highlight border
        this.ctx.strokeStyle = highlightBorderColor;
        this.ctx.lineWidth = 2; // Set the border width
        this.ctx.strokeRect(x, y, this.squareSize, this.squareSize);
    }
    


    createGraphicalBoard(squares, moves) {
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                const isLightSquare = (file + rank) % 2 === 0;
                const squareColor = isLightSquare ? LIGHT_SQUARE_COLOR : DARK_SQUARE_COLOR;
                this.drawSquare(squareColor, file, rank);
                this.drawPiece(squares, file, rank);
            }
        }

        if (moves) {
            this.highlightMoves(moves);
        }
    }
}
