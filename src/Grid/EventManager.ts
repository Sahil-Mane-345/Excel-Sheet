// src/Grid/EventManager.ts

import { Renderer } from "./Renderer";
import { Viewport } from "./Viewport";
import { SelectionManager } from "./SelectionManager";
import { CellEditor } from "./CellEditor";

export class EventManager {

    private scrollContainer: HTMLDivElement;

    private input: HTMLInputElement;

    private label: HTMLLabelElement;

    private isDragging:boolean = false;

    private hasDragged:boolean = false;

    private dragStartRow:number = 0;

    private dragStartColumn:number = 0;

    private dragMode: "cell" | "row" | "column" | "all" = "cell";


    private static readonly AUTO_SCROLL_MARGIN = 20;

    private static readonly AUTO_SCROLL_SPEED = 20;






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

        this.registerMouseEvents();

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

    private registerMouseEvents(): void {

        this.canvas.addEventListener(
            "mousedown",
            this.handleMouseDown
        );

        window.addEventListener(
            "mousemove",
            this.handleMouseMove
        );

        window.addEventListener(
            "mouseup",
            this.handleMouseUp
        );

    }

    private getCellFromMouse(
    event: MouseEvent
) {

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

    return {

        row: Math.floor(
            actualY /
            this.viewport.getDefaultRowHeight()
        ),

        column: Math.floor(
            actualX /
            this.viewport.getDefaultColumnWidth()
        ),

        isRowHeader,

        isColumnHeader,
        isCorner:
        isRowHeader &&
        isColumnHeader

    };

}




    private handleMouseDown = (
    event: MouseEvent
): void => {

    const cell = this.getCellFromMouse(event);

    if (!cell) {
        return;
    }

    this.isDragging = true;

    this.hasDragged = false;

    this.dragStartRow = cell.row;

    this.dragStartColumn = cell.column;

    if (cell.isCorner) {

        this.dragMode = "all";

        this.selectionManager.selectAll(
            this.viewport.getTotalRows(),
            this.viewport.getTotalColumns()
        );

    }
    else if (
        cell.isRowHeader &&
        !cell.isColumnHeader
    ) {

        this.dragMode = "row";

        this.selectionManager.selectRows(
            cell.row,
            cell.row,
            this.viewport.getTotalColumns()
        );

    }
    else if (
        cell.isColumnHeader &&
        !cell.isRowHeader
    ) {

        this.dragMode = "column";

        this.selectionManager.selectColumns(
            cell.column,
            cell.column,
            this.viewport.getTotalRows()
        );

    }
    else {

        this.dragMode = "cell";

        this.selectionManager.selectCell(
            cell.row,
            cell.column
        );

    }

    this.renderer.render();

};






        private handleMouseMove = (
    event: MouseEvent
): void => {

    if (!this.isDragging) {
        return;
    }

    this.autoScroll(event);

    const cell =
    this.getCellFromMouse(event);

if (!cell) {
    return;
}


    this.hasDragged = true;

    switch (this.dragMode) {

        case "cell":

            this.selectionManager.selectRange(
                this.dragStartRow,
                this.dragStartColumn,
                cell.row,
                cell.column
            );

            break;

        case "row":

            this.selectionManager.selectRows(
                this.dragStartRow,
                cell.row,
                this.viewport.getTotalColumns()
            );

            break;

        case "column":

            this.selectionManager.selectColumns(
                this.dragStartColumn,
                cell.column,
                this.viewport.getTotalRows()
            );

            break;

    }

    const selection =
    this.selectionManager.getSelection();
    

if (
    selection.endRow !== cell.row ||
    selection.endColumn !== cell.column
) {

    switch (this.dragMode) {

        case "cell":

            this.selectionManager.selectRange(
                this.dragStartRow,
                this.dragStartColumn,
                cell.row,
                cell.column
            );

            break;

        case "row":

            this.selectionManager.selectRows(
                this.dragStartRow,
                cell.row,
                this.viewport.getTotalColumns()
            );

            break;

        case "column":

            this.selectionManager.selectColumns(
                this.dragStartColumn,
                cell.column,
                this.viewport.getTotalRows()
            );

            break;

    }

    

}

this.renderer.render();
};


    private handleMouseUp = (
        event: MouseEvent
    ): void => {

        if (!this.isDragging) {
            return;
        }

        this.isDragging = false;

        const cell =
            this.getCellFromMouse(event);

        if (!cell) {
            return;
        }

        if (
    !this.hasDragged &&
    this.dragMode === "cell"
)
 {

            this.selectionManager.selectCell(
                cell.row,
                cell.column
            );

            this.label.textContent =
                `${cell.row + 1} : ${String.fromCharCode(65 + (cell.column % 26))}`;

            const selectedCell =
                this.cellEditor.getCell(
                    cell.row,
                    cell.column
                );

            this.input.value =
                selectedCell?.value ?? "";

            this.input.focus();

        }

        this.renderer.render();

    };






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

    private autoScroll(
    event: MouseEvent
): void {

    const rect =
        this.canvas.getBoundingClientRect();

    let scrollX =
        this.scrollContainer.scrollLeft;

    let scrollY =
        this.scrollContainer.scrollTop;

    if (
        event.clientY <
        rect.top +
        EventManager.AUTO_SCROLL_MARGIN
    ) {

        scrollY -=
            EventManager.AUTO_SCROLL_SPEED;

    }

    if (
        event.clientY >
        rect.bottom -
        EventManager.AUTO_SCROLL_MARGIN
    ) {

        scrollY +=
            EventManager.AUTO_SCROLL_SPEED;

    }

    if (
        event.clientX <
        rect.left +
        EventManager.AUTO_SCROLL_MARGIN
    ) {

        scrollX -=
            EventManager.AUTO_SCROLL_SPEED;

    }

    if (
        event.clientX >
        rect.right -
        EventManager.AUTO_SCROLL_MARGIN
    ) {

        scrollX +=
            EventManager.AUTO_SCROLL_SPEED;

    }

    this.scrollContainer.scrollTo({

    left: Math.max(0, scrollX),

    top: Math.max(0, scrollY)

});


}


    
}