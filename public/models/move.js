
export class Move {
    constructor(piece, fileFrom, rankFrom, fileTo, rankTo, isCapture, coversFriendly) {
        this.piece = piece;
        this.fileFrom = fileFrom;
        this.rankFrom = rankFrom;
        this.fileTo = fileTo;
        this.rankTo = rankTo;
        this.isCapture = isCapture;
        this.coversFriendly = coversFriendly;
    }
}
