// src/Grid/EventManager.ts

import { Renderer } from "./Renderer";
import { Viewport } from "./Viewport";
import { SelectionManager } from "./SelectionManager";
import { CellEditor } from "./CellEditor";

export class EventManager {

    private scrollContainer: HTMLDivElement;

    private input: HTMLInputElement;

    private label: HTMLLabelElement;

    constructor(
        private canvas: HTMLCanvasElement,
        private renderer: Renderer,
        private viewport: Viewport,
        private selectionManager: SelectionManager,
        private cellEditor: CellEditor
    ) {

        this.scrollContainer =
            document.getElementById(
                "sheet-container"
            ) as HTMLDivElement;

        this.input =
            document.getElementById(
                "cell-input-bar"
            ) as HTMLInputElement;

        this.label =
            document.getElementById(
                "cell-input-label"
            ) as HTMLLabelElement;

    }

    public initialise(): void {

        this.registerScrollEvent();

        this.registerCanvasClick();

        this.registerInputEvent();

    }

    private registerScrollEvent(): void {

        this.scrollContainer.addEventListener(
            "scroll",
            () => {

                this.viewport.setScroll(
                    this.scrollContainer.scrollLeft,
                    this.scrollContainer.scrollTop
                );

                this.renderer.render();

            }
        );

    }

    private registerCanvasClick(): void {

        this.canvas.addEventListener(
            "click",
            (event) => {

                this.handleCellSelection(event);

            }
        );

    }

    private registerInputEvent(): void {

        this.input.addEventListener(
            "input",
            () => {

                const row =
                    this.selectionManager.getSelectedRow();

                const column =
                    this.selectionManager.getSelectedColumn();

                this.cellEditor.setCell(
                    row,
                    column,
                    this.input.value
                );

                this.renderer.render();

            }
        );

    }

    private handleCellSelection(
        event: MouseEvent
    ): void {

        const rect =
            this.canvas.getBoundingClientRect();

        const mouseX =
            event.clientX -
            rect.left -
            this.viewport.getRowHeaderWidth();

        const mouseY =
            event.clientY -
            rect.top -
            this.viewport.getColumnHeaderHeight();

        if (
            mouseX < 0 ||
            mouseY < 0
        ) {
            return;
        }

        const actualX =
            mouseX +
            this.viewport.getScrollX();

        const actualY =
            mouseY +
            this.viewport.getScrollY();

        const column =
            Math.floor(
                actualX /
                this.viewport.getDefaultColumnWidth()
            );

        const row =
            Math.floor(
                actualY /
                this.viewport.getDefaultRowHeight()
            );

        this.selectionManager.selectCell(
            row,
            column
        );

        this.label.textContent =
            `${row + 1} : ${String.fromCharCode(65 + (column % 26))}`;

        const cell =
            this.cellEditor.getCell(
                row,
                column
            );

        this.input.value =
            cell?.value ?? "";

        this.input.focus();

        this.renderer.render();

    }

}