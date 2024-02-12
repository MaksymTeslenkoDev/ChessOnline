"use client";

import { useEffect, useState } from "react";
import { Board } from "@/models/Board";
import { BoardComponent } from "@/components/BoardComponent";

export default function Home() {
  const [board, setBoard] = useState(new Board());

  useEffect(() => {
    restart();
    // setCurrentPlayer(whitePlayer);
  }, []);

  function restart() {
    const newBoard = new Board();
    newBoard.initCells();
    newBoard.addFigures();
    setBoard(newBoard);
  }

  return (
    <main className="app">
      <BoardComponent board={board} setBoard={setBoard} />
    </main>
  );
}
