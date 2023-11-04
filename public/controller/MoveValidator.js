import { Piece } from "../models/piece.js";


export class MoveValidator {
    constructor(squares, gameLogic) {
        this.squares = squares;
        this.gameLogic = gameLogic;
    }

    isMoveValid(piece, file, rank) {
        const targetPiece = this._getPieceAtPosition(file, rank);
        const isOwnPiece = targetPiece && this.gameLogic.isSameColor(targetPiece, piece);
        return !isOwnPiece;
    }

    _getPieceAtPosition(file, rank) {
        const index = Piece.getIndex(file, rank);
        return this.squares[index];
    }
}
 