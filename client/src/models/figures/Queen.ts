import { Cell } from "../Cell";
import { Figure } from "./Figure";
import blackLogo from "../../assets/black-queen.png";
import whiteLogo from "../../assets/white-queen.png";
import { Colors, FigureNames } from "@/types";

export class Queen extends Figure {
  constructor(color: Colors, cell: Cell, index?: number) {
    super(color, cell, index);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.QUEEN;
  }
  canStep(target: Cell): boolean {
    if (!super.canStep(target)) return false;
    if (this.cell.isEmptyVertical(target)) return true;
    if (this.cell.isEmptyHorizontal(target)) return true;
    if (this.cell.isEmptyDiagonal(target)) return true;
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
}
