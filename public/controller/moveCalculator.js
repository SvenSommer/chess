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
                moves.push({ file: captureFile, rank: nextRank });
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
    
    isWithinBoardBounds(file, rank) {
        return file >= 0 && file < 8 && rank >= 0 && rank < 8;
    }
    

    getKnightMoves(piece, file, rank) {
        // Calculate and return knight moves
        return []; // Placeholder for the actual move calculation
    }

    getBishopMoves(piece, file, rank) {
        // Calculate and return bishop moves
        return []; // Placeholder for the actual move calculation
    }

    getRookMoves(piece, file, rank) {
        // Calculate and return rook moves
        return []; // Placeholder for the actual move calculation
    }

    getQueenMoves(piece, file, rank) {
        // Calculate and return queen moves
        return []; // Placeholder for the actual move calculation
    }

    getKingMoves(piece, file, rank) {
        // Calculate and return king moves
        return []; // Placeholder for the actual move calculation
    }

    // Other helper methods can be added here to assist in calculating moves, such as checking for checks, pins, etc.
}
