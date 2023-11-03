import { Piece } from "../models/piece.js";
import { Board } from "../models/board.js";


export class BoardEventHandler {
    constructor(board) {
        this.board = board;
        this.selectedPiece = null;
        this.offsetX = 0;
        this.offsetY = 0;

        this.board.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.board.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.board.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    getMousePos(evt) {
        const rect = this.board.canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    handleMouseDown(evt) {
        const mousePos = this.getMousePos(evt);
        const file = Math.floor(mousePos.x / this.board.squareSize);
        const rank = Math.floor(mousePos.y / this.board.squareSize);
        const piece = Board.Square[file + rank * 8];

        if (piece) {
            this.selectedPiece = {
                piece,
                file,
                rank
            };
            this.offsetX = mousePos.x - file * this.board.squareSize;
            this.offsetY = mousePos.y - rank * this.board.squareSize;
            Board.Square[file + rank * 8] = null;
            this.board.render.createGraphicalBoard();
            this.board.render.drawPieceAtPosition(piece, mousePos.x - this.offsetX, mousePos.y - this.offsetY);
        }
    }

    handleMouseMove(evt) {
        if (this.selectedPiece) {
            const mousePos = this.getMousePos(evt);
            const x = mousePos.x - this.offsetX;
            const y = mousePos.y - this.offsetY;
            this.board.render.createGraphicalBoard();
            this.board.render.drawPieceAtPosition(this.selectedPiece.piece, x, y);
        }
    }

    handleMouseUp(evt) {
        if (this.selectedPiece) {
            const mousePos = this.getMousePos(evt);
            const file = Math.floor(mousePos.x / this.board.squareSize);
            const rank = Math.floor(mousePos.y / this.board.squareSize);
            const targetIndex = file + rank * 8;
            const targetPiece = Board.Square[targetIndex];

            if (targetPiece !== null && (targetPiece & Piece.ColorMask) !== (this.selectedPiece.piece & Piece.ColorMask)) {
                Board.Square[targetIndex] = null;
            }

            Board.Square[targetIndex] = this.selectedPiece.piece;
            this.selectedPiece = null;
            this.board.render.createGraphicalBoard();
        }
    }
}
