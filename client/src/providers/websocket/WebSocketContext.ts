import {
  Board,
  Colors,
  GameRoom,
  GameRoomWithBoard,
  Move,
  User,
} from "@/types";
import React from "react";

type WebsocketGetawayResult<T = undefined> = {
  status: "success" | "error";
  message: string;
  data?: T;
};

export interface ApiContract {
  user: {
    connect: (
      uuid: string | null
    ) => Promise<WebsocketGetawayResult<{ user: User }>>;
  };
  gameRoom: {
    create: () => Promise<
      WebsocketGetawayResult<{ gameRoom: GameRoomWithBoard }>
    >;
    join: (
      roomId: string,
      userId: string
    ) => Promise<WebsocketGetawayResult<{ gameRoom: GameRoomWithBoard }>>;
    finishGame: (
      roomId: string,
      winner: Colors
    ) => Promise<WebsocketGetawayResult<{ gameRoom: GameRoomWithBoard }>>;
    leave: (
      roomId: string,
      userId: string
    ) => Promise<WebsocketGetawayResult<{ gameRoom: GameRoomWithBoard }>>;
  };
  board: {
    addMove: (
      boardId: string,
      move: Partial<Move> | null
    ) => Promise<
      WebsocketGetawayResult<{ gameRoom: GameRoomWithBoard; board: Board }>
    >;
  };
}

export type WebSocketContextProps = {
  api: ApiContract | null;
  user: User | null;
  gameRoom: GameRoomWithBoard | null;
  board: Board | null;
  currentPlayer: Colors | null;
  playerColor: Colors | null;
  handleUpdateGameRoom: (gameRoom: GameRoomWithBoard) => void;
};

export const WebSocketContext = React.createContext<WebSocketContextProps>(
  {} as WebSocketContextProps
);

export default WebSocketContext;
