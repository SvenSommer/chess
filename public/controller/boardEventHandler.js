import { Piece } from "../models/piece.js";
import { SelectedPiece } from "../models/SelectedPiece.js";
import { GameLogic } from "./GameLogic.js";
import { MoveCalculator } from "./moveCalculator.js";

export class PieceMover {
    constructor(squares, moveCalculator, renderer) {
        this.squares = squares;
        this.moveCalculator = moveCalculator;
        this.renderer = renderer;
        this.selectedPiece = null;
    }

    selectPiece(piece, mousePos) { /* ... */ }
    dragPiece(mousePosition) { /* ... */ }
    dropPiece(mousePos) { /* ... */ }
    placePiece(file, rank) { /* ... */ }
    returnPiece() { /* ... */ }
    isMoveValid(file, rank) { /* ... */ }
}

export class BoardEventHandler {
    constructor(canvas, squareSize, squares, render) {
        this.canvas = canvas;
        this.squareSize = squareSize;
        this.squares = squares;
        this.render = render;
        this.selectedPiece = null;
        this.moveCalculator = new MoveCalculator(squares);
        this.gameLogic = new GameLogic(squares);
        this.attachHandlers();
    }

    attachHandlers() {
        this.canvas.addEventListener('mousedown', evt => this.onMouseDown(evt));
        this.canvas.addEventListener('mousemove', evt => this.onMouseMove(evt));
        this.canvas.addEventListener('mouseup', evt => this.onMouseUp(evt));

        this.canvas.addEventListener('touchstart', evt => this.onTouchStart(evt));
        this.canvas.addEventListener('touchmove', evt => this.onTouchMove(evt));
        this.canvas.addEventListener('touchend', evt => this.onTouchEnd(evt));
    }

    onTouchStart(event) {
        event.preventDefault(); 
        this.onMouseDown(this.translateTouchEvent(event));
    }

    onTouchMove(event) {
        event.preventDefault(); 
        this.onMouseMove(this.translateTouchEvent(event));
    }

    onTouchEnd(event) {
        event.preventDefault(); 
        this.onMouseUp(this.translateTouchEvent(event));
    }

    translateTouchEvent(event) {
        const touch = event.touches[0] || event.changedTouches[0];
        return {
            clientX: touch.clientX,
            clientY: touch.clientY,
            preventDefault: () => event.preventDefault()
        };
    }


    onMouseDown(event) {
        const mousePos = this.getMousePosition(event);
        const piece = this.getPieceAtPosition(this.squares, mousePos);
        if (piece) {
            this.selectPiece(piece, mousePos);
        }
    }

    onMouseMove(event) {
        if (this.selectedPiece) {
            this.dragPiece(this.getMousePosition(event));
        }
    }

    onMouseUp(event) {
        if (this.selectedPiece) {
            this.dropPiece(this.getMousePosition(event));
            this.selectedPiece = null;
            this.render.createGraphicalBoard(this.squares);
        }
    }

    getMousePosition(event) {
        const { left, top } = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - left,
            y: event.clientY - top
        };
    }

    getPieceAtPosition(squares, { x, y }) {
        const { file, rank } = Piece.getFileRankFromPosition(this.squareSize, { x, y });
        return squares[Piece.getIndex(file, rank)];
    }

    selectPiece(piece, mousePos) {
        const { file, rank } = Piece.getFileRankFromPosition(this.squareSize, mousePos);
        const moves = this.moveCalculator.getPossibleMoves(piece, file, rank);
        this.selectedPiece = new SelectedPiece(piece, file, rank, moves);
        this.highlightMoves(moves);
        this.removePieceFromBoard(file, rank);
    }

    highlightMoves(moves) {
        this.render.createGraphicalBoard(this.squares, moves);
    }

    removePieceFromBoard(file, rank) {
        this.squares[Piece.getIndex(file, rank)] = null;
    }

    dragPiece(mousePosition) {
        this.highlightMoves(this.selectedPiece.moves);
        this.renderPieceDraggedByMouse(mousePosition);
    }

    dropPiece(mousePos) {
        const { file, rank } = Piece.getFileRankFromPosition(this.squareSize, mousePos);
        this.placePiece(file, rank);
    }

    renderPieceDraggedByMouse(mousePos) {
        const { x, y } = this.calculatePiecePosition(mousePos);
        this.render.drawPieceAtPosition(this.selectedPiece.piece, x, y);
    }

    calculatePiecePosition(mousePos) {
        const offsetX = mousePos.x % this.squareSize;
        const offsetY = mousePos.y % this.squareSize;
        return {
            x: mousePos.x - offsetX,
            y: mousePos.y - offsetY
        };
    }

    placePiece(file, rank) {
        const moveIsValid = this.isMoveValid(file, rank);
        const originalIndex = Piece.getIndex(this.selectedPiece.file, this.selectedPiece.rank);
        const targetIndex = Piece.getIndex(file, rank);

        if (moveIsValid) {
            this.squares[originalIndex] = null;
            this.squares[targetIndex] = this.selectedPiece.piece;
            this.gameLogic.checkForCheckmate(this.selectedPiece);
        } else {
            this.returnPiece();
        }
    }

    returnPiece() {
        const { file, rank, piece } = this.selectedPiece;
        this.squares[Piece.getIndex(file, rank)] = piece;
    }

    isMoveValid(file, rank) {
        const targetPiece = this.getPieceAtPosition(this.squares, { x: file * this.squareSize, y: rank * this.squareSize });
        const isOwnPiece = targetPiece && this.gameLogic.isSameColor(targetPiece, this.selectedPiece.piece);
        return !isOwnPiece && this.selectedPiece.moves.some(move => move.file === file && move.rank === rank);
    }




 








}
