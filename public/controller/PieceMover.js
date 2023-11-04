import { Piece } from "../models/piece.js";
import { SelectedPiece } from "../models/SelectedPiece.js";
import { GameLogic } from "./GameLogic.js";
import { MoveCalculator } from "./moveCalculator.js";
import { MoveValidator } from "./MoveValidator.js";

export class PieceMover {
    constructor(squares, squareSize, renderer, players) {
        this.squares = squares;
        this.squareSize = squareSize;
        this.renderer = renderer;
        this.players = players;
        this.currentPlayerIndex = 0; // Starten mit dem ersten Spieler
        this.gameLogic = new GameLogic(squares);
        this.moveValidator = new MoveValidator(squares, this.gameLogic);
        this.moveCalculator = new MoveCalculator(squares, this.moveValidator);
        this.selectedPiece = null;
        this.mode = 1
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    switchPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this._checkIfPlayerIsComputer();
    }

    async _checkIfPlayerIsComputer() {
        const currentPlayer = this.getCurrentPlayer();
        if (!currentPlayer.isHuman) {
            let move = this.mode === 0 ? this._getRandomMove() : this.moveCalculator.getBestMoveForPlayer(currentPlayer.color);
            if (move) this.executeMove(move);
        }
    }

    _getRandomMove() {
        const currentPlayerColor = this.getCurrentPlayer().color;
        const possibleMoves = this.moveCalculator.getAllPossibleMovesForPlayer(currentPlayerColor);
        if (possibleMoves.length > 0) {
            const randomMoveIndex = Math.floor(Math.random() * possibleMoves.length);
            const randomMove = possibleMoves[randomMoveIndex];
            return randomMove
        }
        return null;
    }


    executeMove(move) {
        this._selectAndHighlightPiece(move.piece, move.fileFrom, move.rankFrom);
        this._placePiece(move.fileTo, move.rankTo);
        this.renderer.createGraphicalBoard(this.squares);
    }

    selectPiece(mousePos) {
        const piece = this._getPieceAtPosition(mousePos);
        if (!this._isCurrentPlayerPiece(piece)) {
            this._logPieceSelectionError(piece);
            return;
        }
        const { file, rank } = this._calculateFileRankFromPosition(mousePos);

        this._selectAndHighlightPiece(piece, file, rank);
    }

    dragPiece(mousePos) {
        if (this.selectedPiece) {
            this.renderer.createGraphicalBoard(this.squares, this.selectedPiece.moves);
            this._renderPieceDraggedByMouse(mousePos);
        }
    }

    dropPiece(mousePos) {
        if (this.selectedPiece) {
            const { file, rank } = this._calculateFileRankFromPosition(mousePos);
            this._placePiece(file, rank);
            this.renderer.createGraphicalBoard(this.squares);
        }
    }

    _isCurrentPlayerPiece(piece) {
        if (!piece) return false;

        const isWhitePiece = Piece.isWhite(piece);
        const currentPlayerColor = this.getCurrentPlayer().color;

        return (
            (isWhitePiece && currentPlayerColor === 'Weiß') ||
            (!isWhitePiece && currentPlayerColor === 'Schwarz')
        );
    }

    _logPieceSelectionError(piece) {
        const isWhitePiece = Piece.isWhite(piece);
        const currentPlayerColor = this.getCurrentPlayer().color;
        console.error(`Selected piece color mismatch: Piece is ${isWhitePiece ? 'white' : 'black'}, but current player is ${currentPlayerColor}.`);
    }

    _selectAndHighlightPiece(piece, file, rank) {
        const moves = this.moveCalculator.getPossibleMoves(piece, file, rank);
        this.selectedPiece = new SelectedPiece(piece, file, rank, moves);
        this.renderer.createGraphicalBoard(this.squares, moves);
        this._removePieceFromBoard(file, rank);
    }


    async _placePiece(file, rank) {
        if (this._isMoveValid(file, rank)) {
            this._executeMove(file, rank);
            try {

                await this.gameLogic.checkForCheckmate(this.selectedPiece);
            } catch (error) {
                console.error(error);
            }
            this.selectedPiece = null; // This will now be executed after the check
        } else {
            console.log("Move invalid!");
            this._returnPiece();
            this._checkIfPlayerIsComputer();
        }
    }


    _returnPiece() {
        const { file, rank, piece } = this.selectedPiece;
        this.squares[Piece.getIndex(file, rank)] = piece;
    }

    _isMoveValid(file, rank) {
        return this.moveValidator.isMoveValid(this.selectedPiece.piece, file, rank);
    }

    _removePieceFromBoard(file, rank) {
        this.squares[Piece.getIndex(file, rank)] = null;
    }

    _renderPieceDraggedByMouse(mousePos) {
        const { x, y } = this._calculatePiecePosition(mousePos);
        this.renderer.drawPieceAtPosition(this.selectedPiece.piece, x, y);
    }

    _calculatePiecePosition(mousePos) {
        const offsetX = mousePos.x % this.squareSize;
        const offsetY = mousePos.y % this.squareSize;
        return {
            x: mousePos.x - offsetX,
            y: mousePos.y - offsetY
        };
    }

    _getPieceAtPosition({ x, y }) {
        const { file, rank } = this._calculateFileRankFromPosition({ x, y });
        return this.squares[Piece.getIndex(file, rank)];
    }

    _calculateFileRankFromPosition(mousePos) {
        return Piece.getFileRankFromPosition(this.squareSize, mousePos);
    }

    _executeMove(file, rank) {
        const originalIndex = Piece.getIndex(this.selectedPiece.file, this.selectedPiece.rank);
        const targetIndex = Piece.getIndex(file, rank);
        this.squares[originalIndex] = null;
        this.squares[targetIndex] = this.selectedPiece.piece;
        this.switchPlayer()
    }
}
