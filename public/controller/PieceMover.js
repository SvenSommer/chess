import { Piece } from "../models/piece.js";
import { SelectedPiece } from "../models/SelectedPiece.js";
import { GameLogic } from "./GameLogic.js";
import { MoveCalculator } from "./moveCalculator.js";


export class PieceMover {
    constructor(squares, squareSize, renderer) {
        this.squares = squares;
        this.squareSize = squareSize;
        this.moveCalculator = new MoveCalculator(squares);
        this.renderer = renderer;
        this.selectedPiece = null;
        this.gameLogic = new GameLogic(squares);
    }

    selectPiece(mousePos) {
        const piece = this.getPieceAtPosition(this.squares, mousePos);
        const { file, rank } = Piece.getFileRankFromPosition(this.squareSize, mousePos);
        const moves = this.moveCalculator.getPossibleMoves(piece, file, rank);
        this.selectedPiece = new SelectedPiece(piece, file, rank, moves);
        this.highlightMoves(moves);
        this.removePieceFromBoard(file, rank);
    }

    dragPiece(mousePos) {
        if (this.selectedPiece) {
            this.highlightMoves(this.selectedPiece.moves);
            this.renderPieceDraggedByMouse(mousePos);
        }

    }

    dropPiece(mousePos) {
        if (this.selectPiece) {
            const { file, rank } = Piece.getFileRankFromPosition(this.squareSize, mousePos);
            this.placePiece(file, rank);
        }
        this.renderer.createGraphicalBoard(this.squares);
    }

    placePiece(file, rank) {
        const moveIsValid = this.isMoveValid(file, rank);
        const originalIndex = Piece.getIndex(this.selectedPiece.file, this.selectedPiece.rank);
        const targetIndex = Piece.getIndex(file, rank);

        if (moveIsValid) {
            this.squares[originalIndex] = null;
            this.squares[targetIndex] = this.selectedPiece.piece;
            this.gameLogic.checkForCheckmate(this.selectedPiece);
            this.selectedPiece = null;
        } else {
            this.returnPiece();
        }
    }

    returnPiece() {
        const { file, rank, piece } = this.selectedPiece;
        this.squares[Piece.getIndex(file, rank)] = piece;
        this.selectedPiece = null;
    }
    isMoveValid(file, rank) {
        const targetPiece = this.getPieceAtPosition(this.squares, { x: file * this.squareSize, y: rank * this.squareSize });
        const isOwnPiece = targetPiece && this.gameLogic.isSameColor(targetPiece, this.selectedPiece.piece);
        return !isOwnPiece && this.selectedPiece.moves.some(move => move.file === file && move.rank === rank);
    }

    highlightMoves(moves) {
        this.renderer.createGraphicalBoard(this.squares, moves);
    }

    removePieceFromBoard(file, rank) {
        this.squares[Piece.getIndex(file, rank)] = null;
    }

    renderPieceDraggedByMouse(mousePos) {
        const { x, y } = this.calculatePiecePosition(mousePos);
        this.renderer.drawPieceAtPosition(this.selectedPiece.piece, x, y);
    }

    calculatePiecePosition(mousePos) {
        const offsetX = mousePos.x % this.squareSize;
        const offsetY = mousePos.y % this.squareSize;
        return {
            x: mousePos.x - offsetX,
            y: mousePos.y - offsetY
        };
    }

    getPieceAtPosition(squares, { x, y }) {
        const { file, rank } = Piece.getFileRankFromPosition(this.squareSize, { x, y });
        return squares[Piece.getIndex(file, rank)];
    }
}
