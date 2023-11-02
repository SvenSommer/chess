import { Piece } from "./piece.js";

const SQUARE_SIZE = 75;
const LIGHT_SQUARE_COLOR = '#F0D9B5';
const DARK_SQUARE_COLOR = '#B58863';

export class Board {
    static pieceMapping = {
        [Piece.White | Piece.Bishop]: 'lb',
        [Piece.White | Piece.King]: 'lk',
        [Piece.White | Piece.Knight]: 'ln',
        [Piece.White | Piece.Pawn]: 'lp',
        [Piece.White | Piece.Queen]: 'lq',
        [Piece.White | Piece.Rook]: 'lr',
        [Piece.Black | Piece.Bishop]: 'db',
        [Piece.Black | Piece.King]: 'dk',
        [Piece.Black | Piece.Knight]: 'dn',
        [Piece.Black | Piece.Pawn]: 'dp',
        [Piece.Black | Piece.Queen]: 'dq',
        [Piece.Black | Piece.Rook]: 'dr',
    };

    static Square = new Array(64);


    static initializeBoard() {
        const startingPositionFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        Board.loadPositionFromFEN(startingPositionFEN);
    }

    static loadPositionFromFEN(fen) {
        Board.Square.fill(null);
        const [position] = fen.split(' ');
        let squareIndex = 0;

        for (const char of position) {
            if (char === '/') {
                // Move to the next rank
                squareIndex = Math.ceil(squareIndex / 8) * 8;
            } else if (/\d/.test(char)) {
                // Empty squares
                squareIndex += parseInt(char, 10);
            } else {
                const piece = Board.fenToPiece(char);
                if (piece !== null) {
                    Board.Square[squareIndex] = piece;
                }
                squareIndex++;
            }
        }
    }

    static fenToPiece(char) {
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

    constructor(images) {
        this.images = images;
        this.canvas = document.getElementById('chessBoard');
        this.ctx = this.canvas.getContext('2d');
        this.squareSize = SQUARE_SIZE;
        this.selectedPiece = null;
        this.offsetX = 0;
        this.offsetY = 0;

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
        const piece = Board.Square[file + rank * 8];

        if (piece) {
            this.selectedPiece = {
                piece,
                file,
                rank
            };
            this.offsetX = mousePos.x - file * this.squareSize;
            this.offsetY = mousePos.y - rank * this.squareSize;
            Board.Square[file + rank * 8] = null;
        }
    }

    handleMouseMove(evt) {
        if (this.selectedPiece) {
            const mousePos = this.getMousePos(evt);
            const x = mousePos.x - this.offsetX;
            const y = mousePos.y - this.offsetY;
            this.createGraphicalBoard();
            this.drawPieceAtPosition(this.selectedPiece.piece, x, y);
        }
    }

    handleMouseUp(evt) {
        if (this.selectedPiece) {
            const mousePos = this.getMousePos(evt);
            const file = Math.floor(mousePos.x / this.squareSize);
            const rank = Math.floor(mousePos.y / this.squareSize);
            const targetIndex = file + rank * 8;
            const targetPiece = Board.Square[targetIndex];

            // Check if there is a piece on the target square and if it belongs to the opposite player
            if (targetPiece !== null && (targetPiece & Piece.ColorMask) !== (this.selectedPiece.piece & Piece.ColorMask)) {
                // Capture the piece (remove it)
                Board.Square[targetIndex] = null;
            }

            // Place the selected piece on the target square
            Board.Square[targetIndex] = this.selectedPiece.piece;

            this.selectedPiece = null;
            this.createGraphicalBoard();
        }
    }


    drawPieceAtPosition(piece, x, y) {
        const imageName = Board.pieceMapping[piece];
        const image = this.images[imageName];
        if (image) {
            this.ctx.drawImage(image, x, y, this.squareSize, this.squareSize);
        } else {
            console.error(`Image not found: ${imageName}`);
        }
    }

    drawSquare(color, x, y) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
    }

    createGraphicalBoard() {
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                const isLightSquare = (file + rank) % 2 === 0;
                const squareColor = isLightSquare ? LIGHT_SQUARE_COLOR : DARK_SQUARE_COLOR;
                this.drawSquare(squareColor, file, rank);
                this.drawPiece(file, rank);
            }
        }
    }

    drawPiece(file, rank) {
        const pieceCode = Board.Square[file + rank * 8];
        if (pieceCode) {
            const imageName = Board.pieceMapping[pieceCode];
            const image = this.images[imageName];
            if (image) {
                this.ctx.drawImage(image, file * this.squareSize, rank * this.squareSize, this.squareSize, this.squareSize);
            } else {
                console.error(`Image not found: ${imageName}`);
            }
        }
    }
}
