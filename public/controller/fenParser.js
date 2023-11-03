import { Piece } from "../models/piece.js";

export class FENParser {
    static parseFEN(fen) {
        const position = fen.split(' ')[0];
        const squares = new Array(64).fill(null);
        let squareIndex = 0;

        for (const char of position) {
            if (char === '/') {
                squareIndex = Math.ceil(squareIndex / 8) * 8;
            } else if (/\d/.test(char)) {
                squareIndex += parseInt(char, 10);
            } else {
                const piece = FENParser.charToPiece(char);
                if (piece !== null) {
                    squares[squareIndex] = piece;
                }
                squareIndex++;
            }
        }

        return squares;
    }

    static charToPiece(char) {
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