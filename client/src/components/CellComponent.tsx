import { Cell } from "@/models/Cell";

interface CellProps {
  cell: Cell;
  selected: boolean;
  click: (cell: Cell) => void;
}

export function CellComponent({ cell, selected, click }: CellProps) {
  return (
    <div
      className={[
        "cell",
        cell.color,
        selected ? "selected" : "",
        cell.available && cell.figure ? "vulnerable" : "",
      ].join(" ")}
      onClick={() => click(cell)}
    >
      {cell.available && !cell.figure && <div className={"available"} />}
      {cell.figure?.logo && <img src={cell.figure?.logo.src} />}
    </div>
  );
}
