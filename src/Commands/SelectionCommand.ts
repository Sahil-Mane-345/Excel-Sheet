
import { SelectionManager } from "../Grid/SelectionManager";
import type { Command } from "./Command";

export class SelectionCommand implements Command {

    private previousRow: number;

    private previousColumn: number;

    constructor(
        private selectionManager: SelectionManager,
        private row: number,
        private column: number
    ) {

        this.previousRow =
            this.selectionManager.getSelectedRow();

        this.previousColumn =
            this.selectionManager.getSelectedColumn();

    }

    public execute(): void {

        this.selectionManager.selectCell(
            this.row,
            this.column
        );

    }

    public undo(): void {

        this.selectionManager.selectCell(
            this.previousRow,
            this.previousColumn
        );

    }

}