import type { SelectionManager } from "../../Grid/SelectionManager";
import type { Viewport } from "../../Grid/Viewport";
import type { Renderer } from "../../Renderer/Renderer";
import type { InputBarHandler } from "../Input/InputBarHandler";
import type { CellHit, MouseHitTester } from "./MouseHitTester";

export class SelectionHandler {

    private isDragging: boolean = false;

    private hasDragged: boolean = false;

    private dragStartRow: number = 0;

    private dragStartColumn: number = 0;

    private dragMode: "cell" | "row" | "column" | "all" = "cell";

    constructor(
        private viewport: Viewport,
        private renderer: Renderer,
        private selectionManager: SelectionManager,
        private hitTester: MouseHitTester,
        private inputBarHandler: InputBarHandler
    ) { }

    public isActive(): boolean {
        return this.isDragging;
    }

    public startDrag(cell: CellHit): void {

        this.isDragging = true;

        this.hasDragged = false;

        this.dragStartRow = cell.row;

        this.dragStartColumn = cell.column;

        if (cell.isCorner) {

            this.dragMode = "all";

            this.selectionManager.selectAll(
                this.viewport.getTotalRows(),
                this.viewport.getTotalColumns()
            );

        }
        else if (
            cell.isRowHeader &&
            !cell.isColumnHeader
        ) {

            this.dragMode = "row";

            this.selectionManager.selectRows(
                cell.row,
                cell.row,
                this.viewport.getTotalColumns()
            );

        }
        else if (
            cell.isColumnHeader &&
            !cell.isRowHeader
        ) {

            this.dragMode = "column";

            this.selectionManager.selectColumns(
                cell.column,
                cell.column,
                this.viewport.getTotalRows()
            );

        }
        else {

            this.dragMode = "cell";

            this.selectionManager.selectCell(
                cell.row,
                cell.column
            );

        }

        this.renderer.render();

    }

    public onMouseMove(
        event: MouseEvent
    ): void {

        const cell =
            this.hitTester.getCellFromMouse(event);

        if (!cell) {
            return;
        }

        this.hasDragged = true;

        switch (this.dragMode) {

            case "cell":

                this.selectionManager.selectRange(
                    this.dragStartRow,
                    this.dragStartColumn,
                    cell.row,
                    cell.column
                );

                break;

            case "row":

                this.selectionManager.selectRows(
                    this.dragStartRow,
                    cell.row,
                    this.viewport.getTotalColumns()
                );

                break;

            case "column":

                this.selectionManager.selectColumns(
                    this.dragStartColumn,
                    cell.column,
                    this.viewport.getTotalRows()
                );

                break;

        }

        this.renderer.render();

    }

    public onMouseUp(
        event: MouseEvent
    ): void {

        this.isDragging = false;

        const cell =
            this.hitTester.getCellFromMouse(event);

        if (!cell) {
            return;
        }

        if (
            !this.hasDragged &&
            this.dragMode === "cell"
        ) {

            this.selectionManager.selectCell(
                cell.row,
                cell.column
            );

            this.inputBarHandler.startEditingCell(
                cell.row,
                cell.column
            );


        }

        this.renderer.render();

    }

}
