import { Cell } from "../Cell";
import { Figure } from "./Figure";
import blackLogo from "../../assets/black-king.png";
import whiteLogo from "../../assets/white-king.png";
import { Colors, FigureNames } from "@/types";
import _ from "lodash";

export class King extends Figure {
  public isShahState = false;

  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.KING;
    this.hasMoved = false;
  }

  canStep(target: Cell): boolean {
    if (!super.canStep(target)) return false;
    const dx = Math.abs(this.cell.x - target.x);
    const dy = Math.abs(this.cell.y - target.y);
    // Check for castling

    if (dx > 1 || dy > 1) return false;

    return true;
  }

  checkForCastling(target: Cell): boolean {
    if (!super.canStep(target)) return false;
    const cellToBeatKing = this.cell.board.isKingUnderAttack(this.cell);
    const dy = Math.abs(this.cell.y - target.y);
    if (
      !Boolean(cellToBeatKing) &&
      !this.hasMoved &&
      Math.abs(target.x - this.cell.x) === 2 &&
      dy === 0
    ) {
      const rookColumn = target.x === 2 ? 0 : 7;
      const rookCell = this.cell.board.cells[this.cell.y][rookColumn];
      if (
        rookCell.figure &&
        rookCell.figure.name === FigureNames.ROOK &&
        !rookCell.figure.hasMoved
      ) {
        // Check if the squares between the king and the rook are free
        const step = target.x < this.cell.x ? -1 : 1;
        for (let i = this.cell.x + step; i < rookColumn; i += step) {
          if (this.cell.board.cells[this.cell.y][i].figure) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  canMove(target: Cell): boolean {
    if (!super.canMove(target)) return false;
    if (this.checkForCastling(target)) return true;
    if (!this.canStep(target)) return false;
    if (this.willBeUnderAttack(target)) return false;

    return true;
  }

  willBeatKing(target: Cell): boolean {
    return this.canStep(target) ? true : false;
  }

  willBeUnderAttack(target: Cell): boolean {
    const copyBoard = _.cloneDeep(this.cell.board.getCopyBoard());
    const kingCell = copyBoard.getKing(this.color);
    const targetCell = copyBoard.getCell(target.x, target.y);
    if (!kingCell) return false;
    targetCell.figure = kingCell.cell.figure;
    kingCell.cell.figure = null;
    const figuresCells = copyBoard.cells
      .flat()
      .filter((cell) => cell.figure && cell.figure?.color !== this.color);
    for (const cell of figuresCells) {
      if (cell?.figure?.willBeatKing(targetCell)) {
        return true;
      }
    }
    return false;
  }

  moveFigure(target: Cell): void {
    super.moveFigure(target);
    this.hasMoved = true;
  }
}
