import { deepCopyWithoutCircularReferences, generateUID } from "@/helpers";
import { FigureNames, Colors, Move } from "@/types";
import _ from "lodash";
import Logo from "../../assets/black-king.png";
import { Cell } from "../Cell";

export class Figure {
  color: Colors;
  logo: typeof Logo | null;
  cell: Cell;
  name: FigureNames;
  id: string;
  index: number;
  hasMoved: boolean;

  constructor(color: Colors, cell: Cell, index?: number) {
    this.color = color;
    this.cell = cell;
    this.cell.figure = this;
    this.logo = null;
    this.name = FigureNames.FIGURE;
    this.id = generateUID();
    this.hasMoved = false;
    this.index = index ? index : cell.y * 8 + cell.x;
  }

  canMove(target: Cell): boolean {
    if (target.figure?.name === FigureNames.KING) return false;
    return true;
  }

  willOpenKingForAttack(target: Cell) {
    const tempBoardCopy = _.cloneDeep(this.cell.board.getCopyBoard());
    const cellCopy = tempBoardCopy.getCell(this.cell.x, this.cell.y);
    const targetCopy = tempBoardCopy.getCell(target.x, target.y);
    targetCopy.figure = cellCopy.figure;
    cellCopy.figure = null;
    const king = tempBoardCopy.getKing(this.cell.figure!.color);
    if (!king) return false;
    if (!!tempBoardCopy.isKingUnderAttack(king.cell)) {
      return true;
    }
    return false;
  }
  willBeatKing(target: Cell) {}

  moveFigure(target: Cell) {}

  willBeUnderAttack(target: Cell) {}

  canStep(target: Cell) {
    if (target.figure?.color === this.color) return false;
    return true;
  }

  getAllowedCells() {
    const allowedCells: Cell[] = [];

    this.cell.board.cells.flat().forEach((cell) => {
      if (this.canStep(cell)) {
        allowedCells.push(cell);
      }
    });

    return allowedCells;
  }
}
