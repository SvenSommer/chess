import { Piece } from "../models/piece.js";


export class GameLogic {
    constructor(squares) {
        this.squares = squares;
    }

    checkForCheckmate(selectedPiece) {
        const isKingCaptured = this.isKingCaptured(this.getOpponentColor(selectedPiece.piece));
        if (isKingCaptured) {
            alert("Checkmate! The game is over.");
        }
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
