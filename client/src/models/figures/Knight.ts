import { Cell } from "../Cell";
import { Figure } from "./Figure";
import blackLogo from "../../assets/black-knight.png";
import whiteLogo from "../../assets/white-knight.png";
import { Colors, FigureNames } from "@/types";

export class Knight extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.KNIGHT;
  }
  canStep(target: Cell): boolean {
    if (!super.canStep(target)) return false;
    const dx = Math.abs(this.cell.x - target.x);
    const dy = Math.abs(this.cell.y - target.y);
    if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) return true;
    return false;
  }
  canMove(target: Cell): boolean {
    if (!super.canMove(target)) return false;
    if (!this.canStep(target)) return false;
    if (super.willOpenKingForAttack(target)) return false;
    return true;
  }
  willBeatKing(target: Cell): boolean {
    return this.canStep(target);
  }
}
