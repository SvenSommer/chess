import { Piece } from "../models/piece.js";


export class GameLogic {
    constructor(squares) {
        this.squares = squares;
    }

    checkForCheckmate(selectedPiece) {
        return new Promise((resolve, reject) => {
            // Simulate an async operation with setTimeout
            setTimeout(() => {
                try {
                    if (!selectedPiece) {
                        throw new Error("No piece selected for checkmate check.");
                    }
    
                    const isKingCaptured = this.isKingCaptured(this.getOpponentColor(selectedPiece.piece));
                    if (isKingCaptured) {
                        alert("Checkmate! The game is over.");
                    }
                    resolve(); // Resolve the promise when done
                } catch (error) {
                    reject(error); // Reject the promise if there's an error
                }
            }, 0); // Timeout can be set to 0 to defer execution until the call stack is clear
        });
    }

    isKingCaptured(opponentColor) {
        const opponentKing = opponentColor | Piece.King;
        return !this.squares.includes(opponentKing);
    }

    isSameColor(piece1, piece2) {
        return (piece1 & Piece.ColorMask) === (piece2 & Piece.ColorMask);
    }
    getOpponentColor(piece) {
        return (piece & Piece.ColorMask) === Piece.White ? Piece.Black : Piece.White;
    }
}
