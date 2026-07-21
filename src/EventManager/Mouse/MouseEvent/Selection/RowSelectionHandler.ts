import type { SelectionManager } from "../../../../Grid/SelectionManager";
import type { Viewport } from "../../../../Grid/Viewport";
import type { Renderer } from "../../../../Renderer/Renderer";
import { BasePointerHandler } from "../BasePointerHandler";
import type { PointerContext } from "../PointerContext";

export class RowSelectionHandler extends BasePointerHandler {

    private startRow: number = 0;

    constructor(
        private viewport: Viewport,
        private renderer: Renderer,
        private selectionManager: SelectionManager,
    ){
        super();
    }

    public canHandle(context: PointerContext): boolean {
        return context.cell.isRowHeader && !context.cell.isColumnHeader;
    }
    public onPointerDown(context: PointerContext): void {
        this.startRow = context.cell.row;

        this.selectionManager.selectRows(
            this.startRow,
            this.startRow,
            this.viewport.getTotalColumns()
        );

        this.renderer.render();
    }
    public onPointerMove(context: PointerContext): void {
        this.selectionManager.selectRows(
            this.startRow,
            context.cell.row,
            this.viewport.getTotalColumns()
        );

        this.renderer.render();
    }
    public onPointerUp(context: PointerContext): void {
        this.selectionManager.selectRows(
            this.startRow,
            context.cell.row,
            this.viewport.getTotalColumns()
        );

        this.renderer.render();
    }

}