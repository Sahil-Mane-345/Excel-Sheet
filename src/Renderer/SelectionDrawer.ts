import { SelectionType, type SelectionManager } from "../Grid/SelectionManager";
import type { Viewport } from "../Grid/Viewport";
import type { GridGeometry } from "./GridGeometry";

export class SelectionDrawer {

    constructor(
        private context: CanvasRenderingContext2D,
        private canvas: HTMLCanvasElement,
        private viewport: Viewport,
        private selectionManager: SelectionManager,
        private geometry: GridGeometry
    ) { }

    public drawSelection(
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

            const y = this.geometry.getGridY(row);
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

            const y = this.geometry.getGridY(row);
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

            const x = this.geometry.getGridX(column);
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

            const x = this.geometry.getGridX(column);
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

                const x = this.geometry.getGridX(column);
                const y = this.geometry.getGridY(row);

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

            const x = this.geometry.getGridX(visibleStartColumn);
            const y = 0;
            const width = this.geometry.getSpanWidth(
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
            const y = this.geometry.getGridY(visibleStartRow);
            const width = this.canvas.width;
            const height = this.geometry.getSpanHeight(
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

        const x = this.geometry.getGridX(visibleStartColumn);
        const y = this.geometry.getGridY(visibleStartRow);

        const width = this.geometry.getSpanWidth(
            visibleStartColumn,
            visibleEndColumn
        );

        const height = this.geometry.getSpanHeight(
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

            const y = this.geometry.getGridY(row);
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

}
