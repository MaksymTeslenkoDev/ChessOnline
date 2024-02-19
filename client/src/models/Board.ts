import { Colors, FigureNames } from "@/types";
import { deepCopyWithoutCircularReferences } from "@/helpers";
import _ from "lodash";
import { Cell } from "./Cell";
import { Bishop } from "./figures/Bishop";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";

export class Board {
  cells: Cell[][] = [];

  public initCells() {
    for (let i = 0; i < 8; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 !== 0) {
          row.push(new Cell(this, j, i, Colors.BLACK, null)); // black cells
        } else {
          row.push(new Cell(this, j, i, Colors.WHITE, null)); // white cells
        }
      }
      this.cells.push(row);
    }
  }

  public getCopyBoard(): Board {
    const newBoard = new Board();
    newBoard.cells = this.cells;
    return newBoard;
  }

  public highlightCells(selectedCell: Cell | null) {
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j++) {
        const target = row[j];
        target.available = !!selectedCell?.figure?.canMove(target);
      }
    }
  }

  public getKing(color: Colors) {
    return this.cells
      .flat()
      .find(
        (cell) =>
          cell.figure?.color === color && cell.figure?.name === FigureNames.KING
      )?.figure;
  }

  private addPawns() {
    for (let i = 0; i < 8; i++) {
      new Pawn(Colors.BLACK, this.getCell(i, 1));
      new Pawn(Colors.WHITE, this.getCell(i, 6));
    }
  }

  private addKings() {
    new King(Colors.BLACK, this.getCell(4, 0));
    new King(Colors.WHITE, this.getCell(4, 7));
  }

  private addQueens() {
    new Queen(Colors.BLACK, this.getCell(3, 0));
    new Queen(Colors.WHITE, this.getCell(3, 7));
  }

  private addBishops() {
    new Bishop(Colors.BLACK, this.getCell(2, 0));
    new Bishop(Colors.BLACK, this.getCell(5, 0));
    new Bishop(Colors.WHITE, this.getCell(2, 7));
    new Bishop(Colors.WHITE, this.getCell(5, 7));
  }

  private addKnights() {
    new Knight(Colors.BLACK, this.getCell(1, 0));
    new Knight(Colors.BLACK, this.getCell(6, 0));
    new Knight(Colors.WHITE, this.getCell(1, 7));
    new Knight(Colors.WHITE, this.getCell(6, 7));
  }

  private addRooks() {
    new Rook(Colors.BLACK, this.getCell(0, 0));
    new Rook(Colors.BLACK, this.getCell(7, 0));
    new Rook(Colors.WHITE, this.getCell(0, 7));
    new Rook(Colors.WHITE, this.getCell(7, 7));
  }

  public getCell(x: number, y: number) {
    return this.cells[y][x];
  }

  public getCellByFigureIndex(index: number) {
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j++) {
        const target = row[j];
        if (target.figure?.index === index) {
          return target;
        }
      }
    }
  }

  isKingUnderAttack(target: Cell): Cell | undefined {
    const oponentPiecesCells = this.cells
      .flat()
      .filter(
        (cell) => cell.figure && cell.figure.color !== target.figure?.color
      );

    for (const cell of oponentPiecesCells) {
      if (cell?.figure?.willBeatKing(target)) {
        return cell;
      }
    }

    return undefined;
  }

  public isCheckMate(color: Colors) {
    const king = this.getKing(color);
    if (!king) return false;
    const cellToBeatKing = this.isKingUnderAttack(king.cell);
    if (!cellToBeatKing) return false;

    const friendlyPieces = this.cells
      .flat()
      .filter(
        (cell: any) =>
          cell.figure &&
          cell.figure.color === color &&
          cell.figure.name !== FigureNames.KING
      );

    for (let piece of friendlyPieces) {
      const allowedCells = piece.figure?.getAllowedCells();
      if (!allowedCells) continue;
      for (let allowedCell of allowedCells) {
        const copyBoard = _.cloneDeep(this.getCopyBoard());
        const cellByFigureIndex = copyBoard.getCell(piece.x, piece.y);
        const allowedCellCopy = copyBoard.getCell(allowedCell.x, allowedCell.y);
        if (!cellByFigureIndex) continue;

        allowedCellCopy.figure = cellByFigureIndex.figure;
        cellByFigureIndex.figure = null;
        cellByFigureIndex.figure = allowedCellCopy.figure;
        allowedCellCopy.figure = null;

        if (!copyBoard.isKingUnderAttack(king.cell)) {
          return false;
        }
      }
    }

    const allowedKingCells = king.getAllowedCells();
    for (let allowedCell of allowedKingCells) {
      const copyBoard = _.cloneDeep(this.getCopyBoard());
      const kingFigure = copyBoard.getKing(color);
      if (!kingFigure) continue;
      if (!Boolean(kingFigure.willBeUnderAttack(allowedCell))) {
        return false;
      }
    }

    return true;
  }

  public addFigures() {
    this.addPawns();
    this.addKnights();
    this.addKings();
    this.addBishops();
    this.addQueens();
    this.addRooks();
  }
}
