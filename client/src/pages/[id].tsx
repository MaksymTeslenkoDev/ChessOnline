"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Board } from "@/models/Board";
import { isSecondPlayerOnline } from "@/helpers";
import { BoardComponent } from "@/components/BoardComponent";
import { useWebSocket } from "@/providers/websocket/WebSocketProvider";
import { Colors, FigureNames, GameRoom, Move, User } from "@/types";
import { Queen } from "@/models/figures/Queen";
import { Pawn } from "@/models/figures/Pawn";

export default function Home() {
  const router = useRouter();
  const {
    api,
    user,
    gameRoom,
    handleUpdateGameRoom,
    currentPlayer,
    playerColor,
  } = useWebSocket();
  const { id } = router.query;
  const [board, setBoard] = useState(new Board());
  const [checkMate, setCheckMate] = useState<null | Colors>(null);

  async function joinGame() {
    if (id && api && user) {
      const { status, data } = await api.gameRoom.join(id as string, user.id);
      if (status === "success" && data) handleUpdateGameRoom(data.gameRoom);
    }
  }

  useEffect(() => {
    if (board) {
      if (board.isCheckMate(Colors.WHITE)) {
        setCheckMate(Colors.WHITE);
        gameRoom && api && api?.gameRoom.finishGame(gameRoom.id, Colors.BLACK);
      }
      if (board.isCheckMate(Colors.BLACK)) {
        setCheckMate(Colors.BLACK);
        gameRoom && api && api?.gameRoom.finishGame(gameRoom.id, Colors.WHITE);
      }
    }
  }, [board]);

  useEffect(() => {
    if (gameRoom) {
      restart(gameRoom.board.moves);
    }
  }, [gameRoom]);

  useEffect(() => {
    joinGame();
  }, [api, user]);

  function restart(moves: Move[]) {
    const newBoard = new Board();
    newBoard.initCells();
    newBoard.addFigures();
    const reversedMoves = [...moves].reverse();
    for (let move of reversedMoves) {
      const cell = newBoard.getCellByFigureIndex(move.index);
      switch (move.figure) {
        case FigureNames.PAWN:
          new Pawn(move.color, cell!);
          break;
        case FigureNames.QUEEN:
          new Queen(move.color, cell!, +move.index);
          break;
      }
      const targetCell = newBoard.getCell(
        move.targetCell[0],
        move.targetCell[1]
      );
      cell?.moveFigure(targetCell);
      if (Number.isInteger(move.rookIndex) && move.rookTargetCell) {
        const rookCell = newBoard.getCellByFigureIndex(move.rookIndex!);
        const targetCell = newBoard.getCell(
          move.rookTargetCell[0],
          move.rookTargetCell[1]
        );
        rookCell?.moveFigureWithoutCheck(targetCell);
      }
    }
    setBoard(newBoard);
  }

  const handleLeaveGame = async (gameRoomId: string, userId: string) => {
    const res = await api?.gameRoom.leave(gameRoomId, userId);
    if (res?.status === "success") {
      router.push("/");
    }
  };

  const getSideHeader = (
    gameRoom: GameRoom,
    user: User,
    side: "left" | "right"
  ) => {
    if (side === "left" && playerColor === Colors.WHITE) {
      return (
        <div className="header__left">
          <h4>It's You</h4>
          <p>{`Playing for: ${Colors.WHITE.toUpperCase()}`}</p>
          {gameRoom.players[0] === user.id && (
            <button onClick={() => handleLeaveGame(gameRoom.id, user.id)}>
              Leave the game
            </button>
          )}
        </div>
      );
    }
    if (
      side === "left" &&
      playerColor === Colors.BLACK &&
      isSecondPlayerOnline(gameRoom, playerColor)
    ) {
      return (
        <div className="header__left">
          <h4>Your Opponent</h4>
          <p>{`Playing for: ${Colors.WHITE.toUpperCase()}`}</p>
          {gameRoom.players[0] === user.id && (
            <button onClick={() => handleLeaveGame(gameRoom.id, user.id)}>
              Leave the game
            </button>
          )}
        </div>
      );
    }
    if (side === "right" && playerColor === Colors.BLACK) {
      return (
        <div className="header__right">
          <h4>It's You</h4>
          <p>{`Playing for: ${Colors.BLACK.toUpperCase()}`}</p>
          {gameRoom.players[1] === user.id && (
            <button onClick={() => handleLeaveGame(gameRoom.id, user.id)}>
              Leave the game
            </button>
          )}
        </div>
      );
    }
    if (
      side === "right" &&
      playerColor === Colors.WHITE &&
      isSecondPlayerOnline(gameRoom, playerColor)
    ) {
      return (
        <div className="header__right">
          <h4>Your Opponent</h4>
          <p>{`Playing for: ${Colors.BLACK.toUpperCase()}`}</p>
          {gameRoom.players[1] === user.id && (
            <button onClick={() => handleLeaveGame(gameRoom.id, user.id)}>
              Leave the game
            </button>
          )}
        </div>
      );
    }
  };

  return (
    <main className="app">
      {gameRoom && user && (
        <div className="header">
          <div className="header__side">
            {getSideHeader(gameRoom, user, "left")}
          </div>

          <div className="header__center header__side">
            <div>{`Current turn ${currentPlayer?.toUpperCase()}`}</div>
            {checkMate && (
              <div>{`${
                checkMate === Colors.BLACK ? "WHITES" : "BLACKS"
              } WINS`}</div>
            )}
          </div>

          <div className="header__side">
            {getSideHeader(gameRoom, user, "right")}
          </div>
        </div>
      )}

      <BoardComponent
        board={board}
        setBoard={setBoard}
        disabled={!!checkMate}
      />
    </main>
  );
}
