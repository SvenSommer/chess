import { Piece } from "../models/piece.js";
import { Board } from "../models/board.js";


export class FENParser {
    constructor(board) {
        this.board = board;
    }

    loadPositionFromFEN(fen) {
        // Access the static property Square directly from the Board class
        Board.Square.fill(null);
        const [position] = fen.split(' ');
        let squareIndex = 0;

        for (const char of position) {
            if (char === '/') {
                squareIndex = Math.ceil(squareIndex / 8) * 8;
            } else if (/\d/.test(char)) {
                squareIndex += parseInt(char, 10);
            } else {
                const piece = this.fenToPiece(char);
                if (piece !== null) {
                    Board.Square[squareIndex] = piece;
                }
                squareIndex++;
            }
        }
    }

    fenToPiece(char) {
        const color = char === char.toUpperCase() ? Piece.White : Piece.Black;
        const pieceChar = char.toLowerCase();
        switch (pieceChar) {
            case 'p': return color | Piece.Pawn;
            case 'n': return color | Piece.Knight;
            case 'b': return color | Piece.Bishop;
            case 'r': return color | Piece.Rook;
            case 'q': return color | Piece.Queen;
            case 'k': return color | Piece.King;
            default: return null;
        }
    }
}
