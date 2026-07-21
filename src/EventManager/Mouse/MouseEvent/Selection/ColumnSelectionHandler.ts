import type { SelectionManager } from "../../../../Grid/SelectionManager";
import type { Viewport } from "../../../../Grid/Viewport";
import type { Renderer } from "../../../../Renderer/Renderer";
import { BasePointerHandler } from "../BasePointerHandler";
import type { PointerContext } from "../PointerContext";

export class ColumnSelectionHandler extends BasePointerHandler {

    private startColumn: number = 0;

    constructor(
        private viewport: Viewport,
        private renderer: Renderer,
        private selectionManager: SelectionManager,
    ){
        super();
    }

    public canHandle(context: PointerContext): boolean {
        return context.cell.isColumnHeader && !context.cell.isRowHeader;
    }
    public onPointerDown(context: PointerContext): void {
        this.startColumn = context.cell.column;

        this.selectionManager.selectColumns(
            this.startColumn,
            this.startColumn,
            this.viewport.getTotalRows()
        );

        this.renderer.render();
    }
    public onPointerMove(context: PointerContext): void {
        this.selectionManager.selectColumns(
            this.startColumn,
            context.cell.column,
            this.viewport.getTotalRows()
        );

        this.renderer.render();
    }
    public onPointerUp(context: PointerContext): void {
        this.selectionManager.selectColumns(
            this.startColumn,
            context.cell.column,
            this.viewport.getTotalRows()
        );

        this.renderer.render();
    }

}