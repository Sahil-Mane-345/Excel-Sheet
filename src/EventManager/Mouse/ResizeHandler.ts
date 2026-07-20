import { ResizeCommand } from "../../Commands/ResizeCommand";
import type { Viewport } from "../../Grid/Viewport";
import type { Renderer } from "../../Renderer/Renderer";
import type { ScrollSpaceManager } from "../../Renderer/ScrollSpaceManager";
import { UndoRedoHandler } from "../Commands/UndoRedoHandler";
import type { ResizeTarget } from "./MouseHitTester";

export class ResizeHandler {

    private isResizing: boolean = false;

    private resizeMode: "row" | "column" | null = null;

    private resizeIndex: number = -1;

    private resizeStartX: number = 0;

    private resizeStartY: number = 0;

    private resizeStartSize: number = 0;

    constructor(
        private viewport: Viewport,
        private renderer: Renderer,
        private undoRedoHandler: UndoRedoHandler,
        private scrollSpaceManager: ScrollSpaceManager
    ) { }

    public isActive(): boolean {
        return this.isResizing;
    }

    public startResize(
        event: MouseEvent,
        target: ResizeTarget
    ): void {

        this.isResizing = true;

        this.resizeMode = target.mode;

        this.resizeIndex = target.index;

        this.resizeStartX = event.clientX;

        this.resizeStartY = event.clientY;

        this.resizeStartSize =
            this.resizeMode === "row"
                ? this.viewport.getRowHeight(this.resizeIndex)
                : this.viewport.getColumnWidth(this.resizeIndex);

    }

    public onMouseMove(
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

        this.scrollSpaceManager.sync();

        this.renderer.render();

    }

    public onMouseUp(): void {

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

            this.undoRedoHandler.executeCommand(
                resizeCommand
            );
        }

        this.isResizing = false;

        this.resizeMode = null;

        this.resizeIndex = -1;

        this.scrollSpaceManager.sync();

        this.renderer.render();

    }

}
