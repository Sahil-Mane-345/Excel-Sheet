import type { SelectionManager } from "../../../../Grid/SelectionManager";
import type { Viewport } from "../../../../Grid/Viewport";
import type { Renderer } from "../../../../Renderer/Renderer";
import { BasePointerHandler } from "../BasePointerHandler";
import type { PointerContext } from "../PointerContext";

export class SelectAllHandler extends BasePointerHandler {

    constructor(
        private viewport: Viewport,
        private renderer: Renderer,
        private selectionManager: SelectionManager,
    ){
        super();
    }

    public canHandle(context: PointerContext): boolean {
        console.log("All Selection Got Called");
        return context.cell.isCorner;
    }
    public onPointerDown(context: PointerContext): void {
        this.selectionManager.selectAll(this.viewport.getTotalRows(), this.viewport.getTotalColumns());
        this.renderer.render();
    }
    public onPointerMove(context: PointerContext): void {
        throw new Error("Method not implemented.");
    }
    public onPointerUp(context: PointerContext): void {
        throw new Error("Method not implemented.");
    }

}