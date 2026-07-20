import type { Viewport } from "../../Grid/Viewport";


export interface CellHit {
    row: number;
    column: number;
    isRowHeader: boolean;
    isColumnHeader: boolean;
    isCorner: boolean;
}

export interface ResizeTarget {
    mode: "row" | "column" | null;
    index: number;
}

export class MouseHitTester {

    constructor(
        private canvas: HTMLCanvasElement,
        private viewport: Viewport
    ) { }

    public getCellFromMouse(event: MouseEvent): CellHit {

        const rect =
            this.canvas.getBoundingClientRect();

        const canvasX =
            event.clientX - rect.left;

        const canvasY =
            event.clientY - rect.top;

        const isRowHeader =
            canvasX <
            this.viewport.getRowHeaderWidth();

        const isColumnHeader =
            canvasY <
            this.viewport.getColumnHeaderHeight();

        const mouseX =
            canvasX -
            this.viewport.getRowHeaderWidth();

        const mouseY =
            canvasY -
            this.viewport.getColumnHeaderHeight();

        const actualX =
            mouseX +
            this.viewport.getScrollX();

        const actualY =
            mouseY +
            this.viewport.getScrollY();

        let row = 0;

        let currentY = 0;

        while (
            row < this.viewport.getTotalRows() &&
            currentY + this.viewport.getRowHeight(row) <= actualY
        ) {

            currentY += this.viewport.getRowHeight(row);

            row++;

        }

        let column = 0;

        let currentX = 0;

        while (
            column < this.viewport.getTotalColumns() &&
            currentX + this.viewport.getColumnWidth(column) <= actualX
        ) {

            currentX += this.viewport.getColumnWidth(column);

            column++;

        }

        return {
            row,
            column,
            isRowHeader,
            isColumnHeader,
            isCorner:
                isRowHeader &&
                isColumnHeader
        };

    }

    public getResizeTarget(
        event: MouseEvent
    ): ResizeTarget {

        const rect =
            this.canvas.getBoundingClientRect();

        const canvasX =
            event.clientX - rect.left;

        const canvasY =
            event.clientY - rect.top;

        const cell =
            this.getCellFromMouse(event);

        if (!cell) {
            return {
                mode: null,
                index: -1
            };
        }

        if (
            cell.isRowHeader &&
            !cell.isColumnHeader
        ) {

            const y =
                this.viewport.getColumnHeaderHeight() +
                this.viewport.getRowTop(cell.row) -
                this.viewport.getScrollY();

            const rowHeight =
                this.viewport.getRowHeight(cell.row);

            const bottomEdge = y + rowHeight;

            if (
                Math.abs(canvasY - bottomEdge) <= 5
            ) {

                return {
                    mode: "row",
                    index: cell.row
                };

            }

        }
        else if (
            cell.isColumnHeader &&
            !cell.isRowHeader
        ) {

            const x =
                this.viewport.getRowHeaderWidth() +
                this.viewport.getColumnLeft(cell.column) -
                this.viewport.getScrollX();

            const columnWidth =
                this.viewport.getColumnWidth(cell.column);

            const rightEdge = x + columnWidth;

            if (
                Math.abs(canvasX - rightEdge) <= 5
            ) {

                return {
                    mode: "column",
                    index: cell.column
                };

            }

        }

        return {
            mode: null,
            index: -1
        };

    }

}
