class Move {
    // Constants
    static NoFlag = 0b0000;
    static EnPassantCaptureFlag = 0b0001;
    static CastleFlag = 0b0010;
    static PawnTwoUpFlag = 0b0011;
    static PromoteToQueenFlag = 0b0100;
    static PromoteToKnightFlag = 0b0101;
    static PromoteToRookFlag = 0b0110;
    static PromoteToBishopFlag = 0b0111;
  
    // Masks
    static startSquareMask = 0b0000000000111111;
    static targetSquareMask = 0b0000111111000000;
    static flagMask = 0b1111000000000000;
  
    // 16bit move value
    moveValue;
  
    constructor(moveValue) {
      this.moveValue = moveValue;
    }
  
    // Additional constructors can be simulated with static factory methods
    static fromSquares(startSquare, targetSquare) {
      return new Move(startSquare | targetSquare << 6);
    }
  
    static fromSquaresWithFlag(startSquare, targetSquare, flag) {
      return new Move(startSquare | targetSquare << 6 | flag << 12);
    }
  
    get value() {
      return this.moveValue;
    }
  
    get isNull() {
      return this.moveValue === 0;
    }
  
    get startSquare() {
      return this.moveValue & Move.startSquareMask;
    }
  
    get targetSquare() {
      return (this.moveValue & Move.targetSquareMask) >> 6;
    }
  
    get isPromotion() {
      return this.moveFlag >= Move.PromoteToQueenFlag;
    }
  
    get moveFlag() {
      return this.moveValue >> 12;
    }
  
    get promotionPieceType() {
      switch (this.moveFlag) {
        case Move.PromoteToRookFlag:
          return Piece.Rook; // Assuming Piece is defined elsewhere
        case Move.PromoteToKnightFlag:
          return Piece.Knight; // Assuming Piece is defined elsewhere
        case Move.PromoteToBishopFlag:
          return Piece.Bishop; // Assuming Piece is defined elsewhere
        case Move.PromoteToQueenFlag:
          return Piece.Queen; // Assuming Piece is defined elsewhere
        default:
          return Piece.None; // Assuming Piece is defined elsewhere
      }
    }
  
    static get nullMove() {
      return new Move(0);
    }
  
    static sameMove(a, b) {
      return a.moveValue === b.moveValue;
    }
  }