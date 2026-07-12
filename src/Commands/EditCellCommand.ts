
import { CellEditor } from "../Grid/CellEditor";
import type { Command } from "./Command";

export class EditCellCommand implements Command {

    constructor(
        private cellEditor: CellEditor,
        private row: number,
        private column: number,
        private previousValue: string,
        private newValue: string
    ) { }

    public execute(): void {
        this.cellEditor.setCell(this.row, this.column, this.newValue);
    }

    public undo(): void {
        this.cellEditor.setCell(this.row, this.column, this.previousValue);
    }

}