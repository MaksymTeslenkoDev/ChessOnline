import { Cell } from "../Cell";
import { Figure } from "./Figure";
import blackLogo from "../../assets/black-bishop.png";
import whiteLogo from "../../assets/white-bishop.png";
import { Colors, FigureNames } from "@/types";

export class Bishop extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.BISHOP;
  }

  canStep(target: Cell): boolean {
    if (!super.canStep(target)) return false;
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
