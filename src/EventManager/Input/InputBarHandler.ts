import { EditCellCommand } from "../../Commands/EditCellCommand";
import type { CellEditor } from "../../Grid/CellEditor";
import type { Renderer } from "../../Renderer/Renderer";
import { UndoRedoHandler } from "../Commands/UndoRedoHandler";

export class InputBarHandler {

    private input: HTMLInputElement;

    private label: HTMLLabelElement;

    private activeEditRow = -1;

    private activeEditColumn = -1;

    private activeEditOriginalValue = "";

    private activeEditPending = false;

    constructor(
        private renderer: Renderer,
        private cellEditor: CellEditor,

        private undoRedoHandler: UndoRedoHandler
    ) {

        this.input =
            document.getElementById(
                "cell-input-bar"
            ) as HTMLInputElement;

        this.label =
            document.getElementById(
                "cell-input-label"
            ) as HTMLLabelElement;

    }

    public register(): void {

        this.input.addEventListener(
            "input",
            () => {
                if (
                    this.activeEditRow < 0 ||
                    this.activeEditColumn < 0
                ) {
                    return;
                }

                this.cellEditor.setCell(
                    this.activeEditRow,
                    this.activeEditColumn,
                    this.input.value
                );

                this.activeEditPending = true;

                this.renderer.render();

            }
        );

        this.input.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Enter") {
                    this.commitInputCommand();
                    this.renderer.render();
                }
            }
        );

        this.input.addEventListener(
            "blur",
            () => {
                this.commitInputCommand();
            }
        );

    }

    public startEditingCell(
        row: number,
        column: number
    ): void {

        this.label.textContent =
            `${row + 1} : ${String.fromCharCode(65 + (column % 26))}`;

        const selectedCell =
            this.cellEditor.getCell(
                row,
                column
            );

        this.input.value =
            selectedCell?.value ?? "";

        this.input.focus();

        this.activeEditRow = row;
        this.activeEditColumn = column;
        this.activeEditOriginalValue =
            selectedCell?.value ?? "";
        this.activeEditPending = false;

    }

    public commitInputCommand(): void {
        if (
            this.activeEditRow < 0 ||
            this.activeEditColumn < 0 ||
            !this.activeEditPending
        ) {
            return;
        }

        const newValue = this.input.value;

        if (newValue === this.activeEditOriginalValue) {
            this.activeEditPending = false;
            return;
        }

        const command = new EditCellCommand(
            this.cellEditor,
            this.activeEditRow,
            this.activeEditColumn,
            this.activeEditOriginalValue,
            newValue
        );

        this.undoRedoHandler.executeCommand(command);

        this.activeEditOriginalValue = newValue;
        this.activeEditPending = false;
    }

    public syncActiveInput(): void {
        if (
            this.activeEditRow < 0 ||
            this.activeEditColumn < 0
        ) {
            return;
        }

        const cell = this.cellEditor.getCell(
            this.activeEditRow,
            this.activeEditColumn
        );

        this.input.value = cell?.value ?? "";
    }

}
