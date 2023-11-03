export class Piece {
   static None = 0;
   static Pawn = 1;
   static Knight = 2;
   static Bishop = 3;
   static Rook = 4;
   static Queen = 5;
   static King = 6;
 
   static White = 0;
   static Black = 8;
 
   static TypeMask = 0b0111;
   static ColorMask = 0b1000;
 
   static isColor(piece, color) {
     return (piece & Piece.ColorMask) === color && piece !== Piece.None;
   }
 
   static isWhite(piece) {
     return Piece.isColor(piece, Piece.White);
   }
 
   static pieceColor(piece) {
     return piece & Piece.ColorMask;
   }
 
   static pieceType(piece) {
      console.log(piece)
     return piece & Piece.TypeMask;
   }
 
   static isOrthogonalSlider(piece) {
     const type = Piece.pieceType(piece);
     return type === Piece.Queen || type === Piece.Rook;
   }
 
   static isDiagonalSlider(piece) {
     const type = Piece.pieceType(piece);
     return type === Piece.Queen || type === Piece.Bishop;
   }
 
   static isSlidingPiece(piece) {
     const type = Piece.pieceType(piece);
     return type === Piece.Queen || type === Piece.Bishop || type === Piece.Rook;
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
}