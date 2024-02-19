export enum Figure {
  King = 'King',
  Knight = 'Knight',
  Pawn = 'Pawn',
  Queen = 'Queen',
  Rook = 'Rook',
  Bishop = 'Bishop',
}

export enum Color {
  Black = 'black',
  White = 'white',
}
export interface Move {
  color: Color;
  figure: Figure;
  index: number;
  targetCell: number[];
  rookIndex?: number;
  rookTargetCell?: number[];
}

export enum GameRoomStatus {
  Pending = 'pending',
  Finished = 'finished',
  InProcess = 'inProcess',
}
