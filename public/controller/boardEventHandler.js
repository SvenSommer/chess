import { Piece } from "../models/piece.js";
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
            this.selectedPiece = {
                piece,
                file,
                rank,
                moves
            };
            this.offsetX = mousePos.x - file * this.squareSize;
            this.offsetY = mousePos.y - rank * this.squareSize;
            this.squares[file + rank * 8] = null;
            this.render.createGraphicalBoard(this.squares, moves);
            this.render.drawPieceAtPosition(piece, mousePos.x - this.offsetX, mousePos.y - this.offsetY);
        }
    }

    handleMouseMove(evt) {
        if (!this.selectedPiece) return;

        const mousePos = this.getMousePos(evt);
        this.moveSelectedPiece(mousePos);
    }

    getFileRankFromMousePos(mousePos) {
        const file = Math.floor(mousePos.x / this.squareSize);
        const rank = Math.floor(mousePos.y / this.squareSize);
        return { file, rank };
    }

    moveSelectedPiece(mousePos) {
        this.renderBoardWithHighlightedMoves(this.selectedPiece.moves);
        this.renderPieceDraggedByMouse(mousePos);
    }

    renderBoardWithHighlightedMoves(moves) {
        this.render.createGraphicalBoard(this.squares, moves);
    }

    renderPieceDraggedByMouse(mousePos) {
        const x = mousePos.x - this.offsetX;
        const y = mousePos.y - this.offsetY;
        this.render.drawPieceAtPosition(this.selectedPiece.piece, x, y);
    }

    handleMouseUp(evt) {
        if (this.selectedPiece) {
            const mousePos = this.getMousePos(evt);
            const file = Math.floor(mousePos.x / this.squareSize);
            const rank = Math.floor(mousePos.y / this.squareSize);
            const targetIndex = file + rank * 8;
            const targetPiece = this.squares[targetIndex];
            const isOwnPiece = targetPiece && (targetPiece & Piece.ColorMask) === (this.selectedPiece.piece & Piece.ColorMask);
    
            // Überprüfen Sie, ob der Zug in der Liste der möglichen Züge ist und dass das Ziel nicht von einer eigenen Figur besetzt ist
            const isValidMove = !isOwnPiece && this.selectedPiece.moves.some(move => 
                move.file === file && move.rank === rank
            );
    
            if (isValidMove) {
                // Führen Sie den Zug aus, wenn er gültig ist
                // Wenn es eine gegnerische Figur gibt, erfassen Sie sie
                if (targetPiece && !isOwnPiece) {
                    this.squares[targetIndex] = null;
                }
    
                // Führen Sie den Zug aus, indem Sie das ausgewählte Teil bewegen
                this.squares[targetIndex] = this.selectedPiece.piece;
                this.squares[this.selectedPiece.file + this.selectedPiece.rank * 8] = null; // Entfernen Sie das Teil von seinem ursprünglichen Platz
                const opponentColor = (this.selectedPiece.piece & Piece.ColorMask) === Piece.White ? Piece.Black : Piece.White;
                const opponentKing = opponentColor | Piece.King;
                const isKingCaptured = !this.squares.includes(opponentKing);

                if (isKingCaptured) {
                    // Wenn der gegnerische König geschlagen wurde, behandeln Sie das Spielende
                    alert("Schachmatt! Das Spiel ist vorbei.");
                    // Hier könnten Sie weitere Aktionen durchführen, wie das Spiel zu beenden oder eine neue Partie zu starten
                }
            } else {
                // Wenn der Zug nicht gültig ist oder das Ziel von einer eigenen Figur besetzt ist, setzen Sie das Teil auf seinen ursprünglichen Platz zurück
                const originalIndex = this.selectedPiece.file + this.selectedPiece.rank * 8;
                this.squares[originalIndex] = this.selectedPiece.piece;
            }
    
            // Egal ob der Zug gültig ist oder nicht, stellen Sie den Zustand wieder her und aktualisieren Sie das Board
            this.selectedPiece = null;
            this.render.createGraphicalBoard(this.squares);
        }
    }
    
    
    
    
}
