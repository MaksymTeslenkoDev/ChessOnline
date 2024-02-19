import { Cell } from "../Cell";
import { Figure } from "./Figure";
import blackLogo from "../../assets/black-pawn.png";
import whiteLogo from "../../assets/white-pawn.png";
import { Colors, FigureNames } from "@/types";

export class Pawn extends Figure {
  isFirstStep: boolean = true;
  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.PAWN;
  }
  canStep(target: Cell): boolean {
    if (!super.canStep(target)) return false;
    const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
    const firstStepDirection =
      this.cell.figure?.color === Colors.BLACK ? 2 : -2;

    if (
      this.isFirstStep &&
      target.y === this.cell.y + firstStepDirection &&
      target.x === this.cell.x &&
      this.cell.board.getCell(target.x, target.y).isEmpty() &&
      this.cell.board
        .getCell(target.x, JSON.parse(JSON.stringify(this.cell.y + direction)))
        .isEmpty()
    ) {
      return true;
    }

    if (
      target.y === this.cell.y + direction &&
      target.x === this.cell.x &&
      this.cell.board.getCell(target.x, target.y).isEmpty()
    ) {
      return true;
    }

    if (
      target.y === this.cell.y + direction &&
      (target.x === this.cell.x + 1 || target.x === this.cell.x - 1) &&
      this.cell.isEnemy(target)
    ) {
      return true;
    }

    return false;
  }

  canMove(target: Cell): boolean {
    if (!super.canMove(target)) return false;
    if (super.willOpenKingForAttack(target)) return false;
    if (!this.canStep(target)) return false;

    return true;
  }

  willBeatKing(target: Cell): boolean {
    return this.canStep(target) ? true : false;
  }

  moveFigure(target: Cell): void {
    super.moveFigure(target);
    this.isFirstStep = false;
  }
}
