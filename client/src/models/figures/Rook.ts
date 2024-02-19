import { Cell } from "../Cell";
import { Figure } from "./Figure";
import blackLogo from "../../assets/black-rook.png";
import whiteLogo from "../../assets/white-rook.png";
import { Colors, FigureNames } from "@/types";

export class Rook extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.ROOK;
  }
  canStep(target: Cell): boolean {
    if (!super.canStep(target)) return false;
    if (
      this.cell.isEmptyVertical(target) ||
      this.cell.isEmptyHorizontal(target)
    )
      return true;
    return false;
  }
  canMove(target: Cell): boolean {
    if (!super.canMove(target)) return false;
    if (!this.canStep(target)) return false;
    if (super.willOpenKingForAttack(target)) return false;
    return true;
  }

  willBeatKing(target: Cell): boolean {
    return this.canStep(target) ? true : false;
  }

  moveFigure(target: Cell): void {
    super.moveFigure(target);
    this.hasMoved = true;
    // if (this.canMove(target)) {
    //   this.cell.figure = null;
    //   target.figure = this;
    //   this.cell = target;

    // }
  }
}
