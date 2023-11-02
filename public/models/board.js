import { Piece } from "./piece.js";

export async function loadImages() {
    const images = {};
    const pieces = ['b', 'k', 'n', 'p', 'q', 'r'];
    const colors = ['l', 'd'];
    const suffix = 't45.svg';

    for (const color of colors) {
        for (const piece of pieces) {
            const name = `Chess_${piece}${color}${suffix}`;
            const path = `images/${name}`;

            try {
                const response = await fetch(path);
                const svgContent = await response.text();

                const img = new Image();
                const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(svgBlob);

                img.onload = () => {
                    console.log(`Image loaded: ${name}`);
                    URL.revokeObjectURL(url);
                };

                img.onerror = () => {
                    console.error(`Error loading image: ${name}`);
                    URL.revokeObjectURL(url);
                };

                img.src = url;
                images[`${color}${piece}`] = img;

            } catch (error) {
                console.error(`Error fetching image: ${name}`, error);
            }
        }
    }

    return images;
}





export class Board {
    static Square = new Array(64);

    static initializeBoard() {
        Board.Square[0] = Piece.White | Piece.Bishop;
        Board.Square[63] = Piece.Black | Piece.Queen;
        Board.Square[7] = Piece.Black | Piece.Knight;
    }

    constructor(images) {
        this.images = images;
        this.canvas = document.getElementById('chessBoard');
        this.ctx = this.canvas.getContext('2d');
        this.lightCol = '#F0D9B5'; // Light square color
        this.darkCol = '#B58863';  // Dark square color
        this.squareSize = 75;     // Size of each chess square
    }

    drawSquare(color, x, y) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
    }

    createGraphicalBoard() {
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                let isLightSquare = (file + rank) % 2 === 0;
                let squareColor = isLightSquare ? this.lightCol : this.darkCol;
                this.drawSquare(squareColor, file, rank);

                this.drawPiece(file, rank);
            }
        }
    }




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
