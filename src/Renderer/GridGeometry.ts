// src/Grid/Utils/GridGeometry.ts

import type { Viewport } from "../Grid/Viewport";


/**
 * Converts row/column indices into on-screen pixel coordinates
 * (accounting for headers + scroll offset). Shared by every drawer
 * so the math lives in exactly one place.
 */
export class GridGeometry {

    constructor(
        private viewport: Viewport
    ) { }

    public getGridX(column: number): number {
        return (
            this.viewport.getRowHeaderWidth() +
            this.viewport.getColumnLeft(column) -
            this.viewport.getScrollX()
        );
    }

    public getGridY(row: number): number {
        return (
            this.viewport.getColumnHeaderHeight() +
            this.viewport.getRowTop(row) -
            this.viewport.getScrollY()
        );
    }

    public getSpanWidth(
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

    public getSpanHeight(
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

}
