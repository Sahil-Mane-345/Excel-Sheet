
import { CellEditor } from "../Grid/CellEditor";
import type { Command } from "./Command";

export class EditCellCommand implements Command {

    private previousValue: string;

    constructor(
        private cellEditor: CellEditor,
        private row: number,
        private column: number,
        private newValue: string
    ) {

        const cell = this.cellEditor.getCell(
            this.row,
            this.column
        );

        this.previousValue = cell?.value ?? "";

    }

    public execute(): void {

        this.cellEditor.setCell(
            this.row,
            this.column,
            this.newValue
        );

    }

    public undo(): void {

        this.cellEditor.setCell(
            this.row,
            this.column,
            this.previousValue
        );

    }

}