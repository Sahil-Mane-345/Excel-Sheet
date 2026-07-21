import type { Viewport } from "../../../../Grid/Viewport";
import type { Renderer } from "../../../../Renderer/Renderer";
import { BasePointerHandler } from "../BasePointerHandler";
import type { PointerContext } from "../PointerContext";
import { UndoRedoHandler } from '../../../Commands/UndoRedoHandler';
import type { ScrollSpaceManager } from "../../../../Renderer/ScrollSpaceManager";
import { ResizeCommand } from "../../../../Commands/ResizeCommand";

export class RowResizeHandler extends BasePointerHandler{

    private resizeIndex: number = -1;
    private startY: number = 0;
    private startHeight: number = 0;

    constructor(
        private viewport: Viewport,
        private renderer: Renderer,
        private undoRedoHandler: UndoRedoHandler,
        private scrollspaceManager: ScrollSpaceManager
    ){
        super();
    };

    public canHandle(context: PointerContext): boolean {
        return context.resizeTarget.mode === "row";
    }
    public onPointerDown(context: PointerContext): void {
        this.resizeIndex = context.resizeTarget.index;
        this.startY = context.event.clientY;
        this.startHeight = this.viewport.getRowHeight(this.resizeIndex);
    }

    public onPointerMove(context: PointerContext): void {
        const deltaY = context.event.clientY - this.startY;

        this.viewport.setRowHeight(this.resizeIndex, this.startHeight + deltaY);

        this.scrollspaceManager.sync();

        this.renderer.render;
    }

    public onPointerUp(context: PointerContext): void {
        const newHeight = this.viewport.getRowHeight(this.resizeIndex);

        if(newHeight !== this.startHeight ){
            const resizeCommand = new ResizeCommand(this.viewport, "row", this.resizeIndex, this.startHeight, newHeight);

            this.undoRedoHandler.executeCommand(resizeCommand);

            this.resizeIndex = -1;
            this.startHeight = 0;
            this.startY = 0;

            this.scrollspaceManager.sync();

            this.renderer.render();
        }
    }

}