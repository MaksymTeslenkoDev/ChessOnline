import {
  getFromLocalStorage,
  setToLocalStorage,
} from "@/libs/Storage/LocalStorage";
import { useContext, useEffect, useMemo, useReducer } from "react";
import { ApiContract, WebSocketContextProps } from "./WebSocketContext";
import WebSocketContext from "./WebSocketContext";
import {
  SET_API,
  SET_CURRENT_PLAYER,
  SET_GAME_ROOM,
  SET_PLAYER_COLOR,
  SET_USER,
  WebSocketReducer,
} from "./WebSocketReducer";
import { Colors, GameRoomWithBoard } from "@/types";
import { useRouter } from "next/router";

const transports: Record<
  string,
  (url: string) => (structure: any) => Promise<ApiContract> | ApiContract
> = {};

transports.ws =
  (url: string) =>
  ({
    structure,
    listeners,
  }: {
    structure: any;
    listeners: Record<string, any>;
  }) => {
    const socket = new WebSocket(url);
    const api: any = {};
    const services = Object.keys(structure);
    for (const serviceName of services) {
      api[serviceName] = {};
      const service = structure[serviceName];
      const methods = Object.keys(service);
      for (const methodName of methods) {
        api[serviceName][methodName] = (...args: any[]) =>
          new Promise((resolve) => {
            const packet = { name: serviceName, method: methodName, args };
            socket.send(JSON.stringify(packet));
            socket.onmessage = (event) => {
              const data = JSON.parse(event.data);
              if (
                (data.event === "move" ||
                  data.event === "join" ||
                  data.event === "leave") &&
                data.status === "success"
              ) {
                listeners.handleUpdateGameRoom(data.data.gameRoom);
              }
              if (data.event === "join" && data.status !== "success") {
                listeners.handleFailJoinGameRoom();
              }
              resolve(data);
            };
          });
      }
    }

    return new Promise((resolve) => {
      socket.addEventListener("open", () => resolve(api));
    });
  };

const scaffold = (url: string) => {
  const transportLabel = url.split("://")[0];
  const transport = transports[transportLabel];
  return transport(url);
};

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [webSocketState, dispatch] = useReducer(WebSocketReducer, {
    api: null,
    user: null,
    gameRoom: null,
    board: null,
    currentPlayer: Colors.WHITE,
    playerColor: null,
    handleUpdateGameRoom,
  });
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const api = await scaffold("ws://127.0.0.1:8000/")({
        structure: {
          user: {
            connect: ["uuid"],
          },
          gameRoom: {
            create: ["userId"],
            switchPlayer: ["roomId"],
            join: ["roomId", "userId"],
            finishGame: ["roomId", "winner"],
            leave: ["roomId", "userId"],
          },
          board: {
            addMove: ["boardId", "move"],
          },
        },
        listeners: {
          handleUpdateGameRoom,
          handleFailJoinGameRoom: () => router.push("/"),
        },
      });
      dispatch({ type: SET_API, payload: api });
    })();
  }, []);

  useEffect(() => {
    const { user, gameRoom } = webSocketState;
    if (user && gameRoom) {
      const playerIndex = gameRoom?.players.findIndex(
        (value) => value === webSocketState.user?.id
      );

      dispatch({
        type: SET_PLAYER_COLOR,
        payload: playerIndex === 0 ? Colors.WHITE : Colors.BLACK,
      });
    }
  }, [webSocketState.user, webSocketState.gameRoom]);

  useEffect(() => {
    (async () => {
      if (webSocketState.api === null) return;
      const res = await webSocketState.api.user.connect(
        getFromLocalStorage("uuid")
      );
      if (res.status === "success" && res.data) {
        setToLocalStorage("uuid", res.data.user.id);
        dispatch({ type: SET_USER, payload: res.data.user });
      }
    })();
  }, [webSocketState.api]);

  useEffect(() => {
    const moves = webSocketState.gameRoom?.board.moves;
    if (moves) {
      const lastMoveColor = moves[0]?.color;
      dispatch({
        type: SET_CURRENT_PLAYER,
        payload:
          lastMoveColor && lastMoveColor === Colors.WHITE
            ? Colors.BLACK
            : Colors.WHITE,
      });
    }
  }, [
    webSocketState.gameRoom &&
      webSocketState.gameRoom?.board.moves &&
      webSocketState.gameRoom?.board.moves.length,
  ]);

  function handleUpdateGameRoom(gameRoom: GameRoomWithBoard) {
    dispatch({ type: SET_GAME_ROOM, payload: gameRoom });
  }

  return (
    //@ts-ignore
    <WebSocketContext.Provider value={webSocketState}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
