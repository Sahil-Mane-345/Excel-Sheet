// src/Grid/Rendering/GridDrawer.ts

import type { CellEditor } from "../Grid/CellEditor";
import type { Viewport } from "../Grid/Viewport";
import type { GridGeometry } from "./GridGeometry";



/**
 * Default text styling applied when a cell doesn't specify its own
 * font family / size.
 */
const DEFAULT_FONT_FAMILY = "Arial";

const DEFAULT_FONT_SIZE = 14;

/**
 * Left/right padding (in px) kept clear inside the cell before text
 * starts, so glyphs don't butt right up against the grid line.
 */
const TEXT_PADDING_X = 5;

/**
 * Draws per-cell backgrounds, the plain grid lines, and the text
 * content of each visible cell (clipped to the cell's bounds so an
 * oversized font can't spill into neighbouring cells).
 */
export class GridDrawer {

    constructor(
        private context: CanvasRenderingContext2D,
        private viewport: Viewport,
        private cellEditor: CellEditor,
        private geometry: GridGeometry
    ) { }

    /**
     * Fills each visible cell's custom background colour, if it has
     * one. Must run *before* drawGrid so the grid lines are painted
     * on top of the fill rather than being covered by it.
     */
    public drawCellBackgrounds(
        viewport: ReturnType<Viewport["getViewport"]>
    ): void {

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

                if (!cell || !cell.backgroundColor) {
                    continue;
                }

                const x = this.geometry.getGridX(column);
                const y = this.geometry.getGridY(row);

                this.context.fillStyle = cell.backgroundColor;

                this.context.fillRect(
                    x,
                    y,
                    this.viewport.getColumnWidth(column),
                    this.viewport.getRowHeight(row)
                );

            }

        }

    }

    public drawGrid(
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

                const x = this.geometry.getGridX(column);
                const y = this.geometry.getGridY(row);

                this.context.strokeRect(
                    x,
                    y,
                    this.viewport.getColumnWidth(column),
                    this.viewport.getRowHeight(row)
                );

            }

        }

    }

    public drawCells(
        viewport: ReturnType<Viewport["getViewport"]>
    ): void {

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

                const x = this.geometry.getGridX(column);
                const y = this.geometry.getGridY(row);
                const width = this.viewport.getColumnWidth(column);
                const height = this.viewport.getRowHeight(row);

                const fontFamily = cell.fontFamily ?? DEFAULT_FONT_FAMILY;
                const fontSize = cell.fontSize ?? DEFAULT_FONT_SIZE;

                this.context.font = `${fontSize}px ${fontFamily}`;
                this.context.fillStyle = "black";

                // Clip to the cell's own rect so a larger font size
                // (or a long value) can never paint over neighbouring
                // cells, rows, or headers.
                this.context.save();

                this.context.beginPath();
                this.context.rect(x, y, width, height);
                this.context.clip();

                this.context.fillText(
                    cell.value,
                    x + TEXT_PADDING_X,
                    y + height / 2
                );

                this.context.restore();

            }

        }

    }

}
