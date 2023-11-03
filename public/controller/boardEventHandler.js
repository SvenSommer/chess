import { Piece } from "../models/piece.js";
import { Board } from "../models/board.js";
import { MoveCalculator } from "./moveCalculator.js";


export class BoardEventHandler {
    constructor(canvas, squareSize, squares, render) {
        this.canvas = canvas;
        this.squareSize = squareSize;
        this.squares = squares;
        this.render = render;
        this.selectedPiece = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.moveCalculator = new MoveCalculator(squares);

        this.addEventListeners();
    }

    addEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    getMousePos(evt) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    handleMouseDown(evt) {
        const mousePos = this.getMousePos(evt);
        const file = Math.floor(mousePos.x / this.squareSize);
        const rank = Math.floor(mousePos.y / this.squareSize);
        const piece = this.squares[file + rank * 8];

        if (piece) {
            const moves = this.moveCalculator.getPossibleMoves(piece, file, rank);
            console.log("Moves",moves);
            this.selectedPiece = {
                piece,
                file,
                rank
            };
            this.offsetX = mousePos.x - file * this.squareSize;
            this.offsetY = mousePos.y - rank * this.squareSize;
            this.squares[file + rank * 8] = null;
            this.render.createGraphicalBoard(this.squares);
            this.render.drawPieceAtPosition(piece, mousePos.x - this.offsetX, mousePos.y - this.offsetY);
        }
    }

    handleMouseMove(evt) {
        if (this.selectedPiece) {
            const mousePos = this.getMousePos(evt);
            const x = mousePos.x - this.offsetX;
            const y = mousePos.y - this.offsetY;
            this.render.createGraphicalBoard(this.squares);
            this.render.drawPieceAtPosition(this.selectedPiece.piece, x, y);
        }
    }

    handleMouseUp(evt) {
        if (this.selectedPiece) {
            const mousePos = this.getMousePos(evt);
            const file = Math.floor(mousePos.x / this.squareSize);
            const rank = Math.floor(mousePos.y / this.squareSize);
            const targetIndex = file + rank * 8;
            const targetPiece = this.squares[targetIndex];

            if (targetPiece !== null && (targetPiece & Piece.ColorMask) !== (this.selectedPiece.piece & Piece.ColorMask)) {
                this.squares[targetIndex] = null;
            }

            this.squares[targetIndex] = this.selectedPiece.piece;
            this.selectedPiece = null;
            this.render.createGraphicalBoard(this.squares);
        }
    }
}
