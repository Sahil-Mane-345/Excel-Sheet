// src/Grid/Renderer.ts

import { CellEditor } from "./CellEditor";
import { SelectionManager, SelectionType } from "./SelectionManager";
import { Viewport } from "./Viewport";
import { Helpers } from "../Utils/Helpers";

export class Renderer {

    private context: CanvasRenderingContext2D;

    constructor(
        private canvas: HTMLCanvasElement,
        private viewport: Viewport,
        private selectionManager: SelectionManager,
        private cellEditor: CellEditor
    ) {

        const context = this.canvas.getContext("2d");

        if (!context) {
            throw new Error("Unable to get canvas context.");
        }

        this.context = context;

    }

    public render(): void {

        const viewport = this.viewport.getViewport(
            this.canvas.width,
            this.canvas.height
        );

        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.drawSelection(viewport);

        this.drawGrid(viewport);

        this.drawCells(viewport);

        this.drawRowHeaders(viewport);

        this.drawColumnHeaders(viewport);

        this.drawCorner();


    }

    private drawGrid(
        viewport: ReturnType<Viewport["getViewport"]>
    ): void {

        this.context.strokeStyle = "#d0d0d0";
        this.context.lineWidth = 1;

        for (
            let row = viewport.firstRow;
            row <= viewport.firstRow + viewport.visibleRows;
            row++
        ) {

            for (
                let column = viewport.firstColumn;
                column <= viewport.firstColumn + viewport.visibleColumns;
                column++
            ) {

                const x =
                    this.viewport.getRowHeaderWidth() +
                    (column - viewport.firstColumn) *
                    this.viewport.getDefaultColumnWidth() -
                    viewport.columnOffset;

                const y =
                    this.viewport.getColumnHeaderHeight() +
                    (row - viewport.firstRow) *
                    this.viewport.getDefaultRowHeight() -
                    viewport.rowOffset;

                this.context.strokeRect(
                    x,
                    y,
                    this.viewport.getDefaultColumnWidth(),
                    this.viewport.getDefaultRowHeight()
                );

            }

        }

    }

    private drawCells(
        viewport: ReturnType<Viewport["getViewport"]>
    ): void {

        this.context.fillStyle = "black";
        this.context.font = "14px Arial";
        this.context.textAlign = "left";
        this.context.textBaseline = "middle";

        for (
            let row = viewport.firstRow;
            row <= viewport.firstRow + viewport.visibleRows;
            row++
        ) {

            for (
                let column = viewport.firstColumn;
                column <= viewport.firstColumn + viewport.visibleColumns;
                column++
            ) {

                const cell =
                    this.cellEditor.getCell(
                        row,
                        column
                    );

                if (!cell) {
                    continue;
                }

                const x =
                    this.viewport.getRowHeaderWidth() +
                    (column - viewport.firstColumn) *
                    this.viewport.getDefaultColumnWidth() -
                    viewport.columnOffset;

                const y =
                    this.viewport.getColumnHeaderHeight() +
                    (row - viewport.firstRow) *
                    this.viewport.getDefaultRowHeight() -
                    viewport.rowOffset;

                this.context.fillText(
                    cell.value.substring(0,15),
                    x + 5,
                    y +
                        this.viewport.getDefaultRowHeight() /
                            2
                );

            }

        }

    }

    private drawRowHeaders(
        viewport: ReturnType<Viewport["getViewport"]>
    ): void {

        for (
            let row = viewport.firstRow;
            row <= viewport.firstRow + viewport.visibleRows;
            row++
        ) {

            const y =
                this.viewport.getColumnHeaderHeight() +
                (row - viewport.firstRow) *
                this.viewport.getDefaultRowHeight() -
                viewport.rowOffset;

            this.context.fillStyle = "#f3f3f3";

            this.context.fillRect(
                0,
                y,
                this.viewport.getRowHeaderWidth(),
                this.viewport.getDefaultRowHeight()
            );

            this.context.strokeStyle = "#d0d0d0";

            this.context.strokeRect(
                0,
                y,
                this.viewport.getRowHeaderWidth(),
                this.viewport.getDefaultRowHeight()
            );

            this.context.fillStyle = "black";

            this.context.font = "14px Arial";

            this.context.textAlign = "center";

            this.context.textBaseline = "middle";

            this.context.fillText(
                String(row + 1),
                this.viewport.getRowHeaderWidth() / 2,
                y +
                    this.viewport.getDefaultRowHeight() /
                        2
            );

        }

    }

        private drawColumnHeaders(
        viewport: ReturnType<Viewport["getViewport"]>
    ): void {

        for (
            let column = viewport.firstColumn;
            column <= viewport.firstColumn + viewport.visibleColumns;
            column++
        ) {

            const x =
                this.viewport.getRowHeaderWidth() +
                (column - viewport.firstColumn) *
                this.viewport.getDefaultColumnWidth() -
                viewport.columnOffset;

            this.context.fillStyle = "#f3f3f3";

            this.context.fillRect(
                x,
                0,
                this.viewport.getDefaultColumnWidth(),
                this.viewport.getColumnHeaderHeight()
            );

            this.context.strokeStyle = "#d0d0d0";

            this.context.strokeRect(
                x,
                0,
                this.viewport.getDefaultColumnWidth(),
                this.viewport.getColumnHeaderHeight()
            );

            this.context.fillStyle = "black";

            this.context.font = "14px Arial";

            this.context.textAlign = "center";

            this.context.textBaseline = "middle";

            this.context.fillText(
                Helpers.getColumnName(column),
                x + this.viewport.getDefaultColumnWidth() / 2,
                this.viewport.getColumnHeaderHeight() / 2
            );

        }

    }

    private drawCorner(): void {

        this.context.fillStyle = "#f3f3f3";

        this.context.fillRect(
            0,
            0,
            this.viewport.getRowHeaderWidth(),
            this.viewport.getColumnHeaderHeight()
        );

        this.context.strokeStyle = "#d0d0d0";

        this.context.strokeRect(
            0,
            0,
            this.viewport.getRowHeaderWidth(),
            this.viewport.getColumnHeaderHeight()
        );

    }

    
private drawSelection(
    viewport: ReturnType<Viewport["getViewport"]>
): void {

    const selection =
        this.selectionManager.getSelection();

    switch (selection.type) {

        case SelectionType.Cell:
        case SelectionType.Range:

            this.drawCellRangeSelection(
                viewport
            );

            break;

        case SelectionType.Row:

            this.drawRowSelection(
                viewport
            );

            break;

        case SelectionType.Column:

            this.drawColumnSelection(
                viewport
            );

            break;

        case SelectionType.All:

            this.drawAllSelection(
                viewport
            );

            break;

    }

}

private drawAllSelection(
    viewport: ReturnType<Viewport["getViewport"]>
): void {

    this.context.fillStyle = "#e9f5ee";

    for (
        let row = viewport.firstRow;
        row <= viewport.firstRow + viewport.visibleRows;
        row++
    ) {

        const y =
            this.viewport.getColumnHeaderHeight() +
            (row - viewport.firstRow) *
            this.viewport.getDefaultRowHeight() -
            viewport.rowOffset;

        this.context.fillRect(

            this.viewport.getRowHeaderWidth(),

            y,

            this.canvas.width -
            this.viewport.getRowHeaderWidth(),

            this.viewport.getDefaultRowHeight()

        );

    }

    for (
        let row = viewport.firstRow;
        row <= viewport.firstRow + viewport.visibleRows;
        row++
    ) {

        const y =
            this.viewport.getColumnHeaderHeight() +
            (row - viewport.firstRow) *
            this.viewport.getDefaultRowHeight() -
            viewport.rowOffset;

        this.context.fillStyle = "#d0ead7";

        this.context.fillRect(

            0,

            y,

            this.viewport.getRowHeaderWidth(),

            this.viewport.getDefaultRowHeight()

        );

        this.context.fillStyle = "#e9f5ee";

    }

    for (
        let column = viewport.firstColumn;
        column <= viewport.firstColumn + viewport.visibleColumns;
        column++
    ) {

        const x =
            this.viewport.getRowHeaderWidth() +
            (column - viewport.firstColumn) *
            this.viewport.getDefaultColumnWidth() -
            viewport.columnOffset;

        this.context.fillStyle = "#d0ead7";

        this.context.fillRect(

            x,

            0,

            this.viewport.getDefaultColumnWidth(),

            this.viewport.getColumnHeaderHeight()

        );

    }

    this.context.fillStyle = "#d0ead7";

    this.context.fillRect(

        0,

        0,

        this.viewport.getRowHeaderWidth(),

        this.viewport.getColumnHeaderHeight()

    );

}


private drawColumnSelection(
    viewport: ReturnType<Viewport["getViewport"]>
): void {

    const selection =
        this.selectionManager.getSelection();

    const startColumn = Math.min(
        selection.startColumn,
        selection.endColumn
    );

    const endColumn = Math.max(
        selection.startColumn,
        selection.endColumn
    );
    const endRow =
            Math.max(
                selection.startRow,
                selection.endRow
            );

    this.context.fillStyle = "#e9f5ee";

    for (
        let column = startColumn;
        column <= endColumn;
        column++
    ) {

        if (
            column < viewport.firstColumn ||
            column > viewport.firstColumn + viewport.visibleColumns
        ) {
            continue;
        }

        const x =
            this.viewport.getRowHeaderWidth() +
            (column - viewport.firstColumn) *
            this.viewport.getDefaultColumnWidth() -
            viewport.columnOffset;

        this.context.fillRect(
            x,
            this.viewport.getColumnHeaderHeight(),
            this.viewport.getDefaultColumnWidth(),
            this.canvas.height -
            this.viewport.getColumnHeaderHeight()
        );

        this.context.fillRect(
            x,
            0,
            this.viewport.getDefaultColumnWidth(),
            this.viewport.getColumnHeaderHeight()
        );


    }
    

    this.drawSelectionBorder(
            viewport,
            0,
            startColumn,
            endRow,
            endColumn
        );

}




    private drawCellRangeSelection(
        viewport: ReturnType<Viewport["getViewport"]>
    ): void {

        const selection =
            this.selectionManager.getSelection();

        const startRow =
            Math.min(
                selection.startRow,
                selection.endRow
            );

        const endRow =
            Math.max(
                selection.startRow,
                selection.endRow
            );

        const startColumn =
            Math.min(
                selection.startColumn,
                selection.endColumn
            );

        const endColumn =
            Math.max(
                selection.startColumn,
                selection.endColumn
            );

        this.context.fillStyle = "#e9f5ee";

        for (
            let row = startRow;
            row <= endRow;
            row++
        ) {

            if (
                row < viewport.firstRow ||
                row > viewport.firstRow + viewport.visibleRows
            ) {
                continue;
            }

            for (
                let column = startColumn;
                column <= endColumn;
                column++
            ) {

                if (
                    column < viewport.firstColumn ||
                    column > viewport.firstColumn + viewport.visibleColumns
                ) {
                    continue;
                }

                const x =
                    this.viewport.getRowHeaderWidth() +
                    (column - viewport.firstColumn) *
                    this.viewport.getDefaultColumnWidth() -
                    viewport.columnOffset;

                const y =
                    this.viewport.getColumnHeaderHeight() +
                    (row - viewport.firstRow) *
                    this.viewport.getDefaultRowHeight() -
                    viewport.rowOffset;

                this.context.fillRect(
                    x,
                    y,
                    this.viewport.getDefaultColumnWidth(),
                    this.viewport.getDefaultRowHeight()
                );

            }

        }

        this.drawSelectionBorder(
            viewport,
            startRow,
            startColumn,
            endRow,
            endColumn
        );

    }

        private drawSelectionBorder(
            viewport: ReturnType<Viewport["getViewport"]>,
            startRow: number,
            startColumn: number,
            endRow: number,
            endColumn: number
        ): void {

            const visibleStartRow =
                Math.max(startRow, viewport.firstRow);

            const visibleEndRow =
                Math.min(
                    endRow,
                    viewport.firstRow +
                    viewport.visibleRows
                );

            const visibleStartColumn =
                Math.max(
                    startColumn,
                    viewport.firstColumn
                );

            const visibleEndColumn =
                Math.min(
                    endColumn,
                    viewport.firstColumn +
                    viewport.visibleColumns
                );

            if (
                visibleStartRow > visibleEndRow ||
                visibleStartColumn > visibleEndColumn
            ) {
                return;
            }

            const x =
                this.viewport.getRowHeaderWidth() +
                (visibleStartColumn - viewport.firstColumn) *
                this.viewport.getDefaultColumnWidth() -
                viewport.columnOffset;

            const y =
                this.viewport.getColumnHeaderHeight() +
                (visibleStartRow - viewport.firstRow) *
                this.viewport.getDefaultRowHeight() -
                viewport.rowOffset;

            const width =
                (visibleEndColumn - visibleStartColumn + 1) *
                this.viewport.getDefaultColumnWidth();

            const height =
                (visibleEndRow - visibleStartRow + 1) *
                this.viewport.getDefaultRowHeight();

            this.context.strokeStyle = "#107c41";

            this.context.lineWidth = 2;

            this.context.strokeRect(
                x,
                y,
                width,
                height
            );

        }

        private drawRowSelection(
    viewport: ReturnType<Viewport["getViewport"]>
): void {

    const selection =
        this.selectionManager.getSelection();

    const startRow =
        Math.min(
            selection.startRow,
            selection.endRow
        );

    const endRow =
        Math.max(
            selection.startRow,
            selection.endRow
        );

        const startColumn = Math.min(
        selection.startColumn,
        selection.endColumn
    );

    const endColumn = Math.max(
        selection.startColumn,
        selection.endColumn
    );

    this.context.fillStyle =
        "#e9f5ee";

    for (
        let row = startRow;
        row <= endRow;
        row++
    ) {

        if (
            row < viewport.firstRow ||
            row >
            viewport.firstRow +
            viewport.visibleRows
        ) {
            continue;
        }

        const y =
            this.viewport.getColumnHeaderHeight() +
            (row - viewport.firstRow) *
            this.viewport.getDefaultRowHeight() -
            viewport.rowOffset;

        this.context.fillRect(

            this.viewport.getRowHeaderWidth(),

            y,

            this.canvas.width,

            this.viewport.getDefaultRowHeight()

        );

        this.context.fillStyle =
            "#d0ead7";

        this.context.fillRect(

            0,

            y,

            this.viewport.getRowHeaderWidth(),

            this.viewport.getDefaultRowHeight()

        );

        this.context.fillStyle =
            "#e9f5ee";

    }

    this.drawSelectionBorder(
            viewport,
            startRow,
            startColumn,
            endRow,
            endColumn
        );

}






}