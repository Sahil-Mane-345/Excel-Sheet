
import {
    TOTAL_ROWS,
    TOTAL_COLUMNS,
    DEFAULT_ROW_HEIGHT,
    DEFAULT_COLUMN_WIDTH,
    ROW_HEADER_WIDTH,
    COLUMN_HEADER_HEIGHT
} from "../Utils/Constants";

const MIN_ROW_HEIGHT = 20;
const MIN_COLUMN_WIDTH = 80;

export class Viewport {

    private scrollX = 0;

    private scrollY = 0;

    private rowHeights: number[] = [];

    private columnWidths: number[] = [];

    constructor() {

        this.rowHeights = Array.from(
            { length: TOTAL_ROWS },
            () => DEFAULT_ROW_HEIGHT
        );

        this.columnWidths = Array.from(
            { length: TOTAL_COLUMNS },
            () => DEFAULT_COLUMN_WIDTH
        );

    }

    public setScroll(
        scrollX: number,
        scrollY: number
    ): void {

        this.scrollX = scrollX;
        this.scrollY = scrollY;

    }

    public getScrollX(): number {

        return this.scrollX;

    }

    public getScrollY(): number {

        return this.scrollY;

    }

    public getTotalRows(): number {

        return TOTAL_ROWS;

    }

    public getTotalColumns(): number {

        return TOTAL_COLUMNS;

    }

    public getDefaultRowHeight(): number {

        return DEFAULT_ROW_HEIGHT;

    }

    public getDefaultColumnWidth(): number {

        return DEFAULT_COLUMN_WIDTH;

    }

    public getRowHeaderWidth(): number {

        return ROW_HEADER_WIDTH;

    }

    public getColumnHeaderHeight(): number {

        return COLUMN_HEADER_HEIGHT;

    }

    public getTotalSheetHeight(): number {

        let totalHeight = 0;

        for (let row = 0; row < this.rowHeights.length; row++) {

            totalHeight += this.getRowHeight(row);

        }

        return totalHeight;

    }

    public getTotalSheetWidth(): number {

        let totalWidth = 0;

        for (let column = 0; column < this.columnWidths.length; column++) {

            totalWidth += this.getColumnWidth(column);

        }

        return totalWidth;

    }

    public getRowHeight(row: number): number {

        if (row < 0 || row >= this.rowHeights.length) {

            return DEFAULT_ROW_HEIGHT;

        }

        return this.rowHeights[row];

    }

    public getColumnWidth(column: number): number {

        if (column < 0 || column >= this.columnWidths.length) {

            return DEFAULT_COLUMN_WIDTH;

        }

        return this.columnWidths[column];

    }

    public setRowHeight(
        row: number,
        height: number
    ): void {

        if (row < 0 || row >= this.rowHeights.length) {

            return;

        }

        this.rowHeights[row] = Math.max(
            MIN_ROW_HEIGHT,
            height
        );

    }

    public setColumnWidth(
        column: number,
        width: number
    ): void {

        if (column < 0 || column >= this.columnWidths.length) {

            return;

        }

        this.columnWidths[column] = Math.max(
            MIN_COLUMN_WIDTH,
            width
        );

    }

    public getRowTop(row: number): number {

        let top = 0;

        for (let index = 0; index < row; index++) {

            top += this.getRowHeight(index);

        }

        return top;

    }

    public getColumnLeft(column: number): number {

        let left = 0;

        for (let index = 0; index < column; index++) {

            left += this.getColumnWidth(index);

        }

        return left;

    }

    private getRowIndexAt(scrollY: number): number {

        let currentY = 0;

        for (let row = 0; row < TOTAL_ROWS; row++) {

            const rowHeight = this.getRowHeight(row);

            if (currentY + rowHeight > scrollY) {

                return row;

            }

            currentY += rowHeight;

        }

        return TOTAL_ROWS - 1;

    }

    private getColumnIndexAt(scrollX: number): number {

        let currentX = 0;

        for (let column = 0; column < TOTAL_COLUMNS; column++) {

            const columnWidth = this.getColumnWidth(column);

            if (currentX + columnWidth > scrollX) {

                return column;

            }

            currentX += columnWidth;

        }

        return TOTAL_COLUMNS - 1;

    }

    public getViewport(
        canvasWidth: number,
        canvasHeight: number
    ) {

        const firstRow = this.getRowIndexAt(this.scrollY);

        const firstColumn = this.getColumnIndexAt(this.scrollX);

        const rowOffset =
            Math.max(
                0,
                this.scrollY - this.getRowTop(firstRow)
            );

        const columnOffset =
            Math.max(
                0,
                this.scrollX - this.getColumnLeft(firstColumn)
            );

        let visibleRows = 0;

        let currentY = rowOffset;

        let row = firstRow;

        while (
            row < TOTAL_ROWS &&
            currentY <= canvasHeight + rowOffset + 1
        ) {

            visibleRows++;

            currentY += this.getRowHeight(row);

            row++;

        }

        let visibleColumns = 0;

        let currentX = columnOffset;

        let column = firstColumn;

        while (
            column < TOTAL_COLUMNS &&
            currentX <= canvasWidth + columnOffset + 1
        ) {

            visibleColumns++;

            currentX += this.getColumnWidth(column);

            column++;

        }
        visibleColumns += 4;
        visibleRows += 4;

        return {

            firstRow,

            firstColumn,

            visibleRows,

            visibleColumns,

            rowOffset,

            columnOffset

        };

    }

}
