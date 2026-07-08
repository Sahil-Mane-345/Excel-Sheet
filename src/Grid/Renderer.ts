// src/Grid/Renderer.ts

import { CellEditor } from "./CellEditor";
import { SelectionManager } from "./SelectionManager";
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

        this.drawGrid(viewport);

        this.drawCells(viewport);

        this.drawRowHeaders(viewport);

        this.drawColumnHeaders(viewport);

        this.drawCorner();

        this.drawSelection(viewport);

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
                    cell.value,
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

        const row =
            this.selectionManager.getSelectedRow();

        const column =
            this.selectionManager.getSelectedColumn();

        if (
            row < viewport.firstRow ||
            row > viewport.firstRow + viewport.visibleRows ||
            column < viewport.firstColumn ||
            column > viewport.firstColumn + viewport.visibleColumns
        ) {
            return;
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

        this.context.strokeStyle = "#107c41";

        this.context.lineWidth = 2;

        this.context.strokeRect(
            x,
            y,
            this.viewport.getDefaultColumnWidth(),
            this.viewport.getDefaultRowHeight()
        );

    }

}