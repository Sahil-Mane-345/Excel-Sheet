import { SelectionType, type SelectionManager } from "../Grid/SelectionManager";
import type { Viewport } from "../Grid/Viewport";
import { Helpers } from "../Utils/Helpers";
import type { GridGeometry } from "./GridGeometry";

export class HeaderDrawer {

    constructor(
        private context: CanvasRenderingContext2D,
        private viewport: Viewport,
        private selectionManager: SelectionManager,
        private geometry: GridGeometry
    ) { }

    public drawRowHeaders(
        viewport: ReturnType<Viewport["getViewport"]>
    ): void {
        let selection = this.selectionManager.getSelection();

        for (
            let row = viewport.firstRow;
            row < viewport.firstRow + viewport.visibleRows;
            row++
        ) {

            const y = this.geometry.getGridY(row);
            const rowHeight = this.viewport.getRowHeight(row);

            this.context.fillStyle = "#f3f3f3";
            if (selection.type == SelectionType.Row) {
                if (row >= selection.startRow && row <= selection.endRow) {
                    this.context.fillStyle = "#d0ead7";
                }
            }
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

    public drawColumnHeaders(
        viewport: ReturnType<Viewport["getViewport"]>
    ): void {

        let selection = this.selectionManager.getSelection();
        for (
            let column = viewport.firstColumn;
            column < viewport.firstColumn + viewport.visibleColumns;
            column++
        ) {

            const x = this.geometry.getGridX(column);
            const width = this.viewport.getColumnWidth(column);

            this.context.fillStyle = "#f3f3f3";
            if (selection.type == SelectionType.Column) {
                if (column >= selection.startColumn && column <= selection.endColumn) {
                    this.context.fillStyle = "#d0ead7";
                }
            }

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

    public drawCorner(): void {

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

}
