import { ResizeCommand } from "../../../../Commands/ResizeCommand";
import type { Viewport } from "../../../../Grid/Viewport";
import type { Renderer } from "../../../../Renderer/Renderer";
import type { ScrollSpaceManager } from "../../../../Renderer/ScrollSpaceManager";
import type { UndoRedoHandler } from "../../../Commands/UndoRedoHandler";
import { BasePointerHandler } from "../BasePointerHandler";
import type { PointerContext } from "../PointerContext";

export class ColumnResizeHandler extends BasePointerHandler{

    private resizeIndex :number = -1;
    private startX: number = 0;
    private startWidth: number = 0;

    constructor(
        private viewport: Viewport,
        private renderer: Renderer,
        private undoRedoHandler: UndoRedoHandler,
        private scrollspaceManager: ScrollSpaceManager
    ){
        super();
    };

    public canHandle(context: PointerContext): boolean {
        return context.resizeTarget.mode === "column";
    }

    public onPointerDown(context: PointerContext): void {
        this.resizeIndex = context.resizeTarget.index;

        this.startX = context.event.clientX;

        this.startWidth = this.viewport.getColumnWidth(this.resizeIndex);

    }
    public onPointerMove(context: PointerContext): void {
        const deltaX = context.event.clientX - this.startX;

        this.viewport.setColumnWidth(this.resizeIndex, this.startWidth + deltaX);

        this.scrollspaceManager.sync();
        
        this.renderer.render();
    }
    public onPointerUp(context: PointerContext): void {
        const newWidth = this.viewport.getColumnWidth(this.resizeIndex);

        if(newWidth !== this.startWidth){
            const resizeCommand = new ResizeCommand(this.viewport, "column", this.resizeIndex, this.startWidth, newWidth);

            this.undoRedoHandler.executeCommand(resizeCommand);
        }

        this.resizeIndex = -1;
        this.startWidth = 0;
        this.startX = 0;

        this.scrollspaceManager.sync();

        this.renderer.render();
    }

}