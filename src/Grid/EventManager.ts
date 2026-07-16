import { Renderer } from "./Renderer";
import { Viewport } from "./Viewport";
import { SelectionManager } from "./SelectionManager";
import { CellEditor } from "./CellEditor";
import { CommandManager } from "../Commands/CommandManager";
import { EditCellCommand } from "../Commands/EditCellCommand";
import { ResizeCommand } from "../Commands/ResizeCommand";

export class EventManager {

    private scrollContainer: HTMLDivElement;

    private scrollSpace: HTMLDivElement;

    private input: HTMLInputElement;

    private label: HTMLLabelElement;

    private fileInput: HTMLInputElement;

    private isDragging: boolean = false;

    private isResizing: boolean = false;

    private hasDragged: boolean = false;

    private dragStartRow: number = 0;

    private dragStartColumn: number = 0;

    private dragMode: "cell" | "row" | "column" | "all" = "cell";

    private resizeMode: "row" | "column" | null = null;

    private resizeIndex: number = -1;

    private resizeStartX: number = 0;

    private resizeStartY: number = 0;

    private resizeStartSize: number = 0;

    private activeEditRow = -1;

    private activeEditColumn = -1;

    private activeEditOriginalValue = "";

    private activeEditPending = false;

    private commandManager = new CommandManager();

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

        this.scrollSpace =
            document.getElementById(
                "scroll-space"
            ) as HTMLDivElement;

        this.input =
            document.getElementById(
                "cell-input-bar"
            ) as HTMLInputElement;

        this.label =
            document.getElementById(
                "cell-input-label"
            ) as HTMLLabelElement;

        this.fileInput =
            document.getElementById(
                "file-input"
            ) as HTMLInputElement;

    }

    public initialise(): void {

        this.registerScrollEvent();

        this.registerMouseEvents();

        this.registerKeyboardEvents();

        this.registerInputEvent();

        this.syncScrollSpace();

    }

    private registerScrollEvent(): void {
        this.scrollContainer.addEventListener("scroll", () => {
            this.viewport.setScroll(
                this.scrollContainer.scrollLeft,
                this.scrollContainer.scrollTop
            );

            this.renderer.render();
        });
    }

    private registerMouseEvents(): void {
        this.canvas.addEventListener("pointerdown", this.handleMouseDown);
        window.addEventListener("pointermove", this.handleMouseMove);
        window.addEventListener("pointerup", this.handleMouseUp);
    }

    private registerKeyboardEvents(): void {
        window.addEventListener("keydown", this.handleKeyboard);
    }

    private handleKeyboard = (event: KeyboardEvent): void => {
        const isUndo =
            (event.ctrlKey || event.metaKey) &&
            !event.shiftKey &&
            event.key.toLowerCase() === "z";

        const isRedo =
            (event.ctrlKey || event.metaKey) &&
            (event.key.toLowerCase() === "y" ||
                ((event.key.toLowerCase() === "z") && event.shiftKey));

        if (!isUndo && !isRedo) {
            return;
        }

        event.preventDefault();

        this.commitInputCommand();

        if (isUndo) {
            this.commandManager.undo();
        } else {
            this.commandManager.redo();
        }

        this.syncActiveInput();

        this.renderer.render();
    };

    private getCellFromMouse(event: MouseEvent) {
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

    private getResizeTarget(
        event: MouseEvent
    ): { mode: "row" | "column" | null; index: number } {
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

    private updateCursor(
        event: MouseEvent
    ): void {

        const resizeTarget =
            this.getResizeTarget(event);

        if (resizeTarget.mode === "row") {

            this.canvas.style.cursor = "row-resize";

        }
        else if (resizeTarget.mode === "column") {

            this.canvas.style.cursor = "col-resize";

        }
        else {

            this.canvas.style.cursor = "default";

        }

    }

    private resizeByMouse(
        event: MouseEvent
    ): void {

        if (this.resizeMode === "row") {

            const deltaY =
                event.clientY - this.resizeStartY;

            this.viewport.setRowHeight(
                this.resizeIndex,
                this.resizeStartSize + deltaY
            );

        }
        else if (this.resizeMode === "column") {

            const deltaX =
                event.clientX - this.resizeStartX;

            this.viewport.setColumnWidth(
                this.resizeIndex,
                this.resizeStartSize + deltaX
            );

        }

        this.syncScrollSpace();

        this.renderer.render();

    }

    private syncScrollSpace(): void {

        this.scrollSpace.style.width =
            `${this.viewport.getTotalSheetWidth()}px`;

        this.scrollSpace.style.height =
            `${this.viewport.getTotalSheetHeight()}px`;

    }

    private handleMouseDown = (
        event: MouseEvent
    ): void => {

        this.commitInputCommand();

        const resizeTarget =
            this.getResizeTarget(event);

        if (resizeTarget.mode) {

            this.isResizing = true;

            this.isDragging = false;

            this.resizeMode = resizeTarget.mode;

            this.resizeIndex = resizeTarget.index;

            this.resizeStartX = event.clientX;

            this.resizeStartY = event.clientY;

            this.resizeStartSize =
                this.resizeMode === "row"
                    ? this.viewport.getRowHeight(this.resizeIndex)
                    : this.viewport.getColumnWidth(this.resizeIndex);

            event.preventDefault();

            return;

        }

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

        if (this.isResizing) {

            this.resizeByMouse(event);

            return;

        }

        this.updateCursor(event);

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

        this.renderer.render();

    };

    private handleMouseUp = (
        event: MouseEvent
    ): void => {

        if (this.isResizing) {

            const resizeMode = this.resizeMode;
            const previousSize = this.resizeStartSize;
            const newSize =
                resizeMode === "row"
                    ? this.viewport.getRowHeight(this.resizeIndex)
                    : this.viewport.getColumnWidth(this.resizeIndex);

            if (
                resizeMode &&
                previousSize !== newSize
            ) {
                const resizeCommand = new ResizeCommand(
                    this.viewport,
                    resizeMode,
                    this.resizeIndex,
                    previousSize,
                    newSize
                );

                this.commandManager.executeCommand(
                    resizeCommand
                );
            }

            this.isResizing = false;

            this.resizeMode = null;

            this.resizeIndex = -1;

            this.syncScrollSpace();

            this.renderer.render();

            return;

        }

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
        ) {

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

            this.activeEditRow = cell.row;
            this.activeEditColumn = cell.column;
            this.activeEditOriginalValue =
                selectedCell?.value ?? "";
            this.activeEditPending = false;

        }

        this.renderer.render();

    };

    private registerInputEvent(): void {

        this.input.addEventListener(
            "input",
            () => {
                if (
                    this.activeEditRow < 0 ||
                    this.activeEditColumn < 0
                ) {
                    return;
                }

                this.cellEditor.setCell(
                    this.activeEditRow,
                    this.activeEditColumn,
                    this.input.value
                );

                this.activeEditPending = true;

                this.renderer.render();

            }
        );

        this.input.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Enter") {
                    this.commitInputCommand();
                    this.renderer.render();
                }
            }
        );

        this.input.addEventListener(
            "blur",
            () => {
                this.commitInputCommand();
            }
        );

        this.fileInput.addEventListener(
            "change",
            (e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0];

                if (!file) {
                    console.warn("No file selected.");
                    return;
                }

                if (!file.name.toLowerCase().endsWith(".json")) {
                    alert("Please select a valid JSON file.");
                    target.value = "";
                    return;
                }

                const reader = new FileReader();

                reader.onload = () => {
                    try {
                        this.importSheet(reader.result as string);
                    } catch (err) {
                        alert("Invalid JSON format.");
                        console.error("JSON parse error:", err);
                    }
                };

                reader.onerror = () => {
                    alert("Error reading file.");
                    console.error("FileReader error:", reader.error);
                };

                reader.readAsText(file);
            }
        );

    }

    private commitInputCommand(): void {
        if (
            this.activeEditRow < 0 ||
            this.activeEditColumn < 0 ||
            !this.activeEditPending
        ) {
            return;
        }

        const newValue = this.input.value;

        if (newValue === this.activeEditOriginalValue) {
            this.activeEditPending = false;
            return;
        }

        const command = new EditCellCommand(
            this.cellEditor,
            this.activeEditRow,
            this.activeEditColumn,
            this.activeEditOriginalValue,
            newValue
        );

        this.commandManager.executeCommand(command);

        this.activeEditOriginalValue = newValue;
        this.activeEditPending = false;
    }

    private syncActiveInput(): void {
        if (
            this.activeEditRow < 0 ||
            this.activeEditColumn < 0
        ) {
            return;
        }

        const cell = this.cellEditor.getCell(
            this.activeEditRow,
            this.activeEditColumn
        );

        this.input.value = cell?.value ?? "";
    }

    public exportSheet(): string {
        return JSON.stringify({
            cells: this.cellEditor.exportCells()
        });
    }

    public importSheet(json: string): void {
        const sheet = JSON.parse(json);
        this.cellEditor.loadRecords(sheet);
        this.renderer.render();
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