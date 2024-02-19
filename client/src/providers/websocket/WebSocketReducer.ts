import { Board, Colors, GameRoom, GameRoomWithBoard, User } from "@/types";
import { ApiContract, WebSocketContextProps } from "./WebSocketContext";

export const SET_API = "SET_API";
export const SET_USER = "SET_USER";
export const SET_GAME_ROOM = "SET_GAME_ROOM";
export const SET_BOARD = "SET_BOARD";
export const SET_CURRENT_PLAYER = "SET_CURRENT_PLAYER";
export const SET_PLAYER_COLOR = "SET_PLAYER_COLOR";

export type Action = {
  type:
    | typeof SET_API
    | typeof SET_USER
    | typeof SET_GAME_ROOM
    | typeof SET_BOARD
    | typeof SET_CURRENT_PLAYER
    | typeof SET_PLAYER_COLOR;
  payload: User | ApiContract | GameRoomWithBoard | string;
};

export function WebSocketReducer(
  state: WebSocketContextProps,
  action: Action
): WebSocketContextProps {
  switch (action.type) {
    case SET_API: {
      if (!action.payload) return state;
      if (typeof action.payload === "object" && "user" in action.payload) {
        return {
          ...state,
          api: action.payload,
        };
      }
    }
    case SET_USER: {
      if (!action.payload) return state;
      if (typeof action.payload === "object" && "name" in action.payload) {
        return {
          ...state,
          user: action.payload,
        };
      }
    }
    case SET_GAME_ROOM: {
      if (!action.payload) return state;
      if (typeof action.payload === "object" && "players" in action.payload) {
        return {
          ...state,
          gameRoom: action.payload,
        };
      }
    }
    case SET_CURRENT_PLAYER: {
      if (!action.payload) return state;
      if (typeof action.payload === "string") {
        return {
          ...state,
          currentPlayer: action.payload as Colors,
        };
      }
    }
    case SET_PLAYER_COLOR: {
      if (!action.payload) return state;
      if (typeof action.payload === "string") {
        return {
          ...state,
          playerColor: action.payload as Colors,
        };
      }
    }
    default:
      return state;
  }
}
