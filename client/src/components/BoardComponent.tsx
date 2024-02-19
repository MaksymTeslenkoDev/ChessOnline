import { Board } from "@/models/Board";
import React, { useEffect, useState } from "react";
import { CellComponent } from "./CellComponent";
import { Cell } from "@/models/Cell";
import { useWebSocket } from "@/providers";
import { FigureNames, Move } from "@/types";

function isPawn(cell: Cell) {
  return cell.figure?.name === FigureNames.PAWN;
}

function isPawnSwap(cell: Cell) {
  return cell.y === 0 || cell.y === 7;
}

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  disabled?: boolean;
}

export function BoardComponent({ board, setBoard, disabled }: BoardProps) {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  const { api, user, gameRoom, currentPlayer, playerColor } = useWebSocket();

  useEffect(() => {
    highlightCells();
  }, [selectedCell]);

  async function click(cell: Cell) {
    if (playerColor === currentPlayer && !disabled) {
      if (
        selectedCell &&
        selectedCell !== cell &&
        selectedCell.figure?.canMove(cell) &&
        gameRoom &&
        api &&
        user &&
        currentPlayer
      ) {
        let rookCellCoordinates: number[] | null = null;
        let rookIndex: number | null = null;
        // Handle castling
        if (
          selectedCell.figure.name === FigureNames.KING &&
          Math.abs(cell.x - selectedCell.x) === 2
        ) {
          const rookColumn = cell.x === 2 ? 0 : 7;
          const rookTargetColumn = cell.x === 2 ? 3 : 5;
          const rookCell = selectedCell.board.cells[selectedCell.y][rookColumn];
          const rookTargetCell =
            selectedCell.board.cells[selectedCell.y][rookTargetColumn];

          if (rookCell.figure) {
            rookCellCoordinates = [rookTargetCell.x, rookTargetCell.y];
            rookIndex = rookCell.figure.index;
          }
        }

        const stepMove: Move = {
          color: selectedCell.figure.color,
          figure:
            isPawn(selectedCell) && isPawnSwap(cell)
              ? FigureNames.QUEEN
              : selectedCell.figure.name,
          index: selectedCell.figure.index,
          targetCell: [cell.x, cell.y],
          rookTargetCell: rookCellCoordinates || undefined,
          rookIndex: rookIndex !== null ? rookIndex : undefined,
        };

        const { status } = await api.board.addMove(gameRoom.boardId, stepMove);

        if (status !== "success") {
          setSelectedCell(null);
          return;
        }

        // await api.board.addMove(gameRoom.boardId, rookStepMove);

        setSelectedCell(null);
      } else {
        if (cell.figure?.color === currentPlayer) {
          setSelectedCell(cell);
        }
      }
    }
  }

  function highlightCells() {
    board.highlightCells(selectedCell);
    updateBoard();
  }

  function updateBoard() {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
  }

  return (
    <div className="board">
      {board.cells.map((row, index) => (
        <React.Fragment key={index}>
          {row.map((cell) => (
            <CellComponent
              cell={cell}
              key={cell.id}
              selected={
                cell.x === selectedCell?.x && cell.y === selectedCell?.y
              }
              click={click}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
