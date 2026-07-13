// src/Grid/Renderer.ts

import { CellEditor } from "./CellEditor";
import { SelectionManager, SelectionType } from "./SelectionManager";
import { Viewport } from "./Viewport";
import { Helpers } from "../Utils/Helpers";
import type { SelectionStatsManager } from "./SelectionStatsManager";

export class Renderer {

    private context: CanvasRenderingContext2D;
    private readonly statusBarHeight = 24;

    constructor(
        private canvas: HTMLCanvasElement,
        private viewport: Viewport,
        private selectionManager: SelectionManager,
        private selectionStatsManager: SelectionStatsManager,
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

        if(this.selectionManager.getSelection().type != SelectionType.All){
            this.drawSelectionStats();
        }

    }

    private drawGrid(
        viewport: ReturnType<Viewport["getViewport"]>
    ): void {

        this.context.strokeStyle = "#d0d0d0";
        this.context.lineWidth = 1;

        for (
            let row = viewport.firstRow;
            row < viewport.firstRow + viewport.visibleRows;
            row++
        ) {

            for (
                let column = viewport.firstColumn;
                column < viewport.firstColumn + viewport.visibleColumns;
                column++
            ) {

                const x = this.getGridX(column);
                const y = this.getGridY(row);

                this.context.strokeRect(
                    x,
                    y,
                    this.viewport.getColumnWidth(column),
                    this.viewport.getRowHeight(row)
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
            row < viewport.firstRow + viewport.visibleRows;
            row++
        ) {

            for (
                let column = viewport.firstColumn;
                column < viewport.firstColumn + viewport.visibleColumns;
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

                const x = this.getGridX(column);
                const y = this.getGridY(row);
                
                this.context.fillText(
                    cell.value.substring(0, 12),
                    x + 5,
                    y + this.viewport.getRowHeight(row) / 2
                );

            }

        }

    }

    private drawRowHeaders(
        viewport: ReturnType<Viewport["getViewport"]>
    ): void {

        for (
            let row = viewport.firstRow;
            row < viewport.firstRow + viewport.visibleRows;
            row++
        ) {

            const y = this.getGridY(row);
            const rowHeight = this.viewport.getRowHeight(row);

            this.context.fillStyle = "#f3f3f3";
            this.context.fillRect(0, y, this.viewport.getRowHeaderWidth(), rowHeight);

            this.context.strokeStyle = "#d0d0d0";
            this.context.strokeRect(0, y, this.viewport.getRowHeaderWidth(), rowHeight);

            this.context.fillStyle = "black";
            this.context.font = "14px Arial";
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";

            this.context.fillText(
                String(row + 1),
                this.viewport.getRowHeaderWidth() / 2,
                y + rowHeight / 2
            );

        }

    }

    private drawColumnHeaders(
        viewport: ReturnType<Viewport["getViewport"]>
    ): void {

        for (
            let column = viewport.firstColumn;
            column < viewport.firstColumn + viewport.visibleColumns;
            column++
        ) {

            const x = this.getGridX(column);
            const width = this.viewport.getColumnWidth(column);

            this.context.fillStyle = "#f3f3f3";
            this.context.fillRect(x, 0, width, this.viewport.getColumnHeaderHeight());

            this.context.strokeStyle = "#d0d0d0";
            this.context.strokeRect(x, 0, width, this.viewport.getColumnHeaderHeight());

            this.context.fillStyle = "black";
            this.context.font = "14px Arial";
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";

            this.context.fillText(
                Helpers.getColumnName(column),
                x + width / 2,
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
                this.drawCellRangeSelection(viewport);
                break;

            case SelectionType.Row:
                this.drawRowSelection(viewport);
                break;

            case SelectionType.Column:
                this.drawColumnSelection(viewport);
                break;

            case SelectionType.All:
                this.drawAllSelection(viewport);
                break;

        }

    }

    private drawAllSelection(
        viewport: ReturnType<Viewport["getViewport"]>
    ): void {

        this.context.fillStyle = "#e9f5ee";

        for (
            let row = viewport.firstRow;
            row < viewport.firstRow + viewport.visibleRows;
            row++
        ) {

            const y = this.getGridY(row);
            const rowHeight = this.viewport.getRowHeight(row);

            this.context.fillRect(
                this.viewport.getRowHeaderWidth(),
                y,
                this.canvas.width - this.viewport.getRowHeaderWidth(),
                rowHeight
            );

        }

        for (
            let row = viewport.firstRow;
            row < viewport.firstRow + viewport.visibleRows;
            row++
        ) {

            const y = this.getGridY(row);
            const rowHeight = this.viewport.getRowHeight(row);

            this.context.fillStyle = "#d0ead7";

            this.context.fillRect(
                0,
                y,
                this.viewport.getRowHeaderWidth(),
                rowHeight
            );

            this.context.fillStyle = "#e9f5ee";

        }

        for (
            let column = viewport.firstColumn;
            column < viewport.firstColumn + viewport.visibleColumns;
            column++
        ) {

            const x = this.getGridX(column);
            const width = this.viewport.getColumnWidth(column);

            this.context.fillStyle = "#d0ead7";

            this.context.fillRect(
                x,
                0,
                width,
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

        this.context.fillStyle = "#e9f5ee";

        for (
            let column = startColumn;
            column <= endColumn;
            column++
        ) {

            if (
                column < viewport.firstColumn ||
                column >= viewport.firstColumn + viewport.visibleColumns
            ) {
                continue;
            }

            const x = this.getGridX(column);
            const width = this.viewport.getColumnWidth(column);

            this.context.fillRect(
                x,
                this.viewport.getColumnHeaderHeight(),
                width,
                this.canvas.height - this.viewport.getColumnHeaderHeight()
            );

            this.context.fillRect(
                x,
                0,
                width,
                this.viewport.getColumnHeaderHeight()
            );

        }

        this.drawSelectionBorder(
            viewport,
            0,
            startColumn,
            0,
            endColumn,
            SelectionType.Column
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
                row >= viewport.firstRow + viewport.visibleRows
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
                    column >= viewport.firstColumn + viewport.visibleColumns
                ) {
                    continue;
                }

                const x = this.getGridX(column);
                const y = this.getGridY(row);

                this.context.fillRect(
                    x,
                    y,
                    this.viewport.getColumnWidth(column),
                    this.viewport.getRowHeight(row)
                );

            }

        }

        this.drawSelectionBorder(
            viewport,
            startRow,
            startColumn,
            endRow,
            endColumn,
            SelectionType.Cell
        );

    }

    private drawSelectionBorder(
        viewport: ReturnType<Viewport["getViewport"]>,
        startRow: number,
        startColumn: number,
        endRow: number,
        endColumn: number,
        selectionType: SelectionType
    ): void {

        let visibleStartRow = Math.max(startRow, viewport.firstRow);
        let visibleEndRow = Math.min(
            endRow,
            viewport.firstRow + viewport.visibleRows - 1
        );

        let visibleStartColumn = Math.max(
            startColumn,
            viewport.firstColumn
        );

        let visibleEndColumn = Math.min(
            endColumn,
            viewport.firstColumn + viewport.visibleColumns - 1
        );

        if (selectionType === SelectionType.Column) {

            if (visibleStartColumn > visibleEndColumn) {
                return;
            }

            const x = this.getGridX(visibleStartColumn);
            const y = 0;
            const width = this.getSpanWidth(
                visibleStartColumn,
                visibleEndColumn
            );
            const height = this.canvas.height;

            this.context.strokeStyle = "#107c41";
            this.context.lineWidth = 2;

            this.context.strokeRect(
                x,
                y,
                width,
                height
            );

            return;

        }

        if (selectionType === SelectionType.Row) {

            if (visibleStartRow > visibleEndRow) {
                return;
            }

            const x = 0;
            const y = this.getGridY(visibleStartRow);
            const width = this.canvas.width;
            const height = this.getSpanHeight(
                visibleStartRow,
                visibleEndRow
            );

            this.context.strokeStyle = "#107c41";
            this.context.lineWidth = 2;

            this.context.strokeRect(
                x,
                y,
                width,
                height
            );

            return;

        }

        if (
            visibleStartRow > visibleEndRow ||
            visibleStartColumn > visibleEndColumn
        ) {
            return;
        }

        const x = this.getGridX(visibleStartColumn);
        const y = this.getGridY(visibleStartRow);

        const width = this.getSpanWidth(
            visibleStartColumn,
            visibleEndColumn
        );

        const height = this.getSpanHeight(
            visibleStartRow,
            visibleEndRow
        );

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

        this.context.fillStyle = "#e9f5ee";

        for (
            let row = startRow;
            row <= endRow;
            row++
        ) {

            if (
                row < viewport.firstRow ||
                row >= viewport.firstRow + viewport.visibleRows
            ) {
                continue;
            }

            const y = this.getGridY(row);
            const rowHeight = this.viewport.getRowHeight(row);

            this.context.fillRect(
                this.viewport.getRowHeaderWidth(),
                y,
                this.canvas.width,
                rowHeight
            );

            this.context.fillStyle = "#d0ead7";

            this.context.fillRect(
                0,
                y,
                this.viewport.getRowHeaderWidth(),
                rowHeight
            );

            this.context.fillStyle = "#e9f5ee";

        }

        this.drawSelectionBorder(
            viewport,
            startRow,
            0,
            endRow,
            this.viewport.getTotalColumns() - 1,
            SelectionType.Row
        );

    }

    private getSpanWidth(
        startColumn: number,
        endColumn: number
    ): number {

        let width = 0;

        for (
            let column = startColumn;
            column <= endColumn;
            column++
        ) {

            width += this.viewport.getColumnWidth(column);

        }

        return width;

    }

    private getSpanHeight(
        startRow: number,
        endRow: number
    ): number {

        let height = 0;

        for (
            let row = startRow;
            row <= endRow;
            row++
        ) {

            height += this.viewport.getRowHeight(row);

        }

        return height;

    }

    private getGridX(column: number): number {
        return (
            this.viewport.getRowHeaderWidth() +
            this.viewport.getColumnLeft(column) -
            this.viewport.getScrollX()
        );
    }

    private getGridY(row: number): number {
        return (
            this.viewport.getColumnHeaderHeight() +
            this.viewport.getRowTop(row) -
            this.viewport.getScrollY()
        );
    }

   

private drawSelectionStats(): void {

    const stats = this.selectionStatsManager.calculate(
        this.selectionManager.getSelection(),
        this.cellEditor
    );

    const y = this.canvas.height - this.statusBarHeight;

    this.context.fillStyle = "#f3f3f3";
    this.context.fillRect(
        0,
        y - 10,
        this.canvas.width,
        this.statusBarHeight
    );

    this.context.strokeStyle = "#d0d0d0";
    this.context.beginPath();
    this.context.moveTo(0, y -10);
    this.context.lineTo(this.canvas.width, y - 10);
    this.context.stroke();

    this.context.fillStyle = "#333";
    this.context.font = "13px Arial";
    this.context.textAlign = "left";
    this.context.textBaseline = "middle";

    const text =
        `Count: ${stats.cellCount}    ` +
        `Sum: ${stats.sum}    ` +
        `Avg: ${stats.average.toFixed(2)}    ` +
        `Min: ${stats.min ?? "-"}    ` +
        `Max: ${stats.max ?? "-"}`;

    this.context.fillText(
        text,
        8,
        (y + this.statusBarHeight / 2) - 10
    );

}

}