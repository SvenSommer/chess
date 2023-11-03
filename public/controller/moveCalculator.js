import { Piece } from "../models/piece.js";

export class MoveCalculator {
    constructor(Square) {
        this.Square = Square;
    }

    getPossibleMoves(piece, file, rank) {
        switch (Piece.pieceType(piece)) {
            case Piece.Pawn:
                return this.getPawnMoves(piece, file, rank);
            case Piece.Knight:
                return this.getKnightMoves(piece, file, rank);
            case Piece.Bishop:
                return this.getBishopMoves(piece, file, rank);
            case Piece.Rook:
                return this.getRookMoves(piece, file, rank);
            case Piece.Queen:
                return this.getQueenMoves(piece, file, rank);
            case Piece.King:
                return this.getKingMoves(piece, file, rank);
            default:
                return [];
        }
    }

    getPawnMoves(piece, file, rank) {
        const moves = [];
        const direction = (piece & Piece.ColorMask) === Piece.White ? -1 : 1; // White pawns move up (decreasing rank), black pawns move down (increasing rank)
        const startRank = (piece & Piece.ColorMask) === Piece.White ? 6 : 1; // White pawns start at rank 6, black pawns at rank 1
    
        // Move forward one square
        let nextRank = rank + direction;
        if (this.isSquareEmpty(file, nextRank)) {
            moves.push({ file, rank: nextRank });
    
            // Move forward two squares if on starting rank
            if (rank === startRank) {
                nextRank += direction;
                if (this.isSquareEmpty(file, nextRank)) {
                    moves.push({ file, rank: nextRank });
                }
            }
        }
    
        // Captures
        const captureFiles = [file - 1, file + 1]; // Pawns can capture one file to the left or right
        for (const captureFile of captureFiles) {
            if (this.isSquareOccupiedByOpponent(captureFile, nextRank, piece)) {
                moves.push({ file: captureFile, rank: nextRank, isCapture: true });
            }
        }
    
        return moves;
    }
    
    isSquareEmpty(file, rank) {
        if (this.isWithinBoardBounds(file, rank)) {
            return this.Square[file + rank * 8] === null;
        }
        return false;
    }
    
    isSquareOccupiedByOpponent(file, rank, piece) {
        if (this.isWithinBoardBounds(file, rank)) {
            const targetPiece = this.Square[file + rank * 8];
            return targetPiece !== null && (targetPiece & Piece.ColorMask) !== (piece & Piece.ColorMask);
        }
        return false;
    }

    isSquareOccupiedByOwnPiece(file, rank, piece) {
        if (this.isWithinBoardBounds(file, rank)) {
            const targetPiece = this.Square[file + rank * 8];
            return targetPiece !== null && (targetPiece & Piece.ColorMask) === (piece & Piece.ColorMask);
        }
        return false;
    }
    
    isWithinBoardBounds(file, rank) {
        return file >= 0 && file < 8 && rank >= 0 && rank < 8;
    }
    
    getKnightMoves(piece, file, rank) {
        const moves = [];
        const knightMoves = [
            { file: -1, rank: -2 }, { file: 1, rank: -2 },
            { file: -2, rank: -1 }, { file: 2, rank: -1 },
            { file: -2, rank: 1 }, { file: 2, rank: 1 },
            { file: -1, rank: 2 }, { file: 1, rank: 2 }
        ];
    
        for (const move of knightMoves) {
            const newFile = file + move.file;
            const newRank = rank + move.rank;
            if (this.isWithinBoardBounds(newFile, newRank)) {
                const moveDetails = { file: newFile, rank: newRank };
                if (this.isSquareOccupiedByOpponent(newFile, newRank, piece)) {
                    moveDetails.isCapture = true;
                } else if (this.isSquareOccupiedByOwnPiece(newFile, newRank, piece)) {
                    moveDetails.coversFriendly = true;
                }
                moves.push(moveDetails);
            }
        }
    
        return moves;
    }

    getBishopMoves(piece, file, rank) {
        return this.getSlidingMoves(piece, file, rank, [
            { file: -1, rank: -1 }, { file: 1, rank: -1 },
            { file: -1, rank: 1 }, { file: 1, rank: 1 }
        ]);
    }
    
    getRookMoves(piece, file, rank) {
        return this.getSlidingMoves(piece, file, rank, [
            { file: 0, rank: -1 }, { file: 0, rank: 1 },
            { file: -1, rank: 0 }, { file: 1, rank: 0 }
        ]);
    }
    
    getQueenMoves(piece, file, rank) {
        // Queen moves are a combination of Rook and Bishop moves
        return [
            ...this.getBishopMoves(piece, file, rank),
            ...this.getRookMoves(piece, file, rank)
        ];
    }
    
    getKingMoves(piece, file, rank) {
        const moves = [];
        const kingMoves = [
            { file: -1, rank: -1 }, { file: 0, rank: -1 }, { file: 1, rank: -1 },
            { file: -1, rank: 0 }, /* { file: 0, rank: 0 }, skip this one */ { file: 1, rank: 0 },
            { file: -1, rank: 1 }, { file: 0, rank: 1 }, { file: 1, rank: 1 }
        ];
    
        for (const move of kingMoves) {
            const newFile = file + move.file;
            const newRank = rank + move.rank;
            if (this.isWithinBoardBounds(newFile, newRank) && !this.isSquareOccupiedByOwnPiece(newFile, newRank, piece)) {
                moves.push({ file: newFile, rank: newRank, isCapture: this.isSquareOccupiedByOpponent(newFile, newRank, piece) });
            }
        }
    
        return moves;
    }
    
    getSlidingMoves(piece, file, rank, directions) {
        const moves = [];
        for (const direction of directions) {
            let newFile = file + direction.file;
            let newRank = rank + direction.rank;
            while (this.isWithinBoardBounds(newFile, newRank)) {
                const moveDetails = { file: newFile, rank: newRank };
                if (this.isSquareOccupiedByOwnPiece(newFile, newRank, piece)) {
                    moveDetails.coversFriendly = true;
                    moves.push(moveDetails);
                    break; // Stop at the first encountered piece
                } else {
                    if (this.isSquareOccupiedByOpponent(newFile, newRank, piece)) {
                        moveDetails.isCapture = true;
                        moves.push(moveDetails);
                        break; // Can capture but can't move further
                    }
                    moves.push(moveDetails);
                }
                newFile += direction.file;
                newRank += direction.rank;
            }
        }
        return moves;
    }
}
