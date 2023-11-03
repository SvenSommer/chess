
import { PieceMover } from "./PieceMover.js";

export class BoardEventHandler {
    constructor(canvas, squareSize, squares, renderer, players) {
        this.canvas = canvas;
        this.squareSize = squareSize;
        this.squares = squares;
        this.render = renderer;
        this.selectedPiece = null;
        this.pieceMover = new PieceMover(squares, squareSize, renderer, players);
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
        this.pieceMover.selectPiece(mousePos);
    }

    onMouseMove(event) {
        const mousePos = this.getMousePosition(event);
        this.pieceMover.dragPiece(mousePos);
    }

    onMouseUp(event) {
        const mousePos = this.getMousePosition(event);
        this.pieceMover.dropPiece(mousePos);
    }

    getMousePosition(event) {
        const { left, top } = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - left,
            y: event.clientY - top
        };
    }
}
