export interface User {
  id: string;
  name: string;
  won: number;
  lost: number;
}

export enum Colors {
  BLACK = "black",
  WHITE = "white",
}

export enum FigureNames {
  FIGURE = "Figure",
  KING = "King",
  KNIGHT = "Knight",
  PAWN = "Pawn",
  QUEEN = "Queen",
  ROOK = "Rook",
  BISHOP = "Bishop",
}

export interface Move {
  color: Colors;
  index: number;
  figure: FigureNames;
  targetCell: number[];
  rookIndex?: number;
  rookTargetCell?: number[];
}

export enum GameRoomStatus {
  Pending = "pending",
  Finished = "finished",
  InProcess = "inProcess",
}

export interface GameRoom {
  id: string;
  status: GameRoomStatus;
  players: string[];
  winner: string | null;
  boardId: string;
}

export interface Board {
  id: string;
  moves: Move[];
}

export type GameRoomWithBoard = GameRoom & { board: Board };
