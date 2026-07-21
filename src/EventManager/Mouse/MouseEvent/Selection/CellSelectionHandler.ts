import type { SelectionManager } from "../../../../Grid/SelectionManager";
import type { Renderer } from "../../../../Renderer/Renderer";
import { BasePointerHandler } from "../BasePointerHandler";
import type { PointerContext } from "../PointerContext";
import { InputBarHandler } from '../../../Input/InputBarHandler';
import type { AutoScroller } from "../../AutoScroller";

export class CellSelectionHandler extends BasePointerHandler {

    private startColumn: number = 0;

    private startRow: number = 0;

    private hasMoved: boolean = false;

    constructor(
        private inputBarHandler: InputBarHandler,
        private renderer: Renderer,
        private selectionManager: SelectionManager,
        private autoScroller: AutoScroller
    ){
        super();
    }

    public canHandle(context: PointerContext): boolean {
        console.log("Cell Selection Got Called");
        return !context.cell.isRowHeader && !context.cell.isColumnHeader;
    }

    public onPointerDown(context: PointerContext): void {
        this.startRow = context.cell.row;
        this.startColumn = context.cell.column;
        this.hasMoved = false;

        this.selectionManager.selectCell(
            this.startRow,
            this.startColumn
        );

        this.autoScroller.startAutoScroll(context.event, 
            () => {
                this.selectionManager.selectRange(
                    this.startRow,
                    this.startColumn,
                    context.cell.row,
                    context.cell.column
                )
            }
        );

        this.renderer.render();
    }

    public onPointerMove(context: PointerContext): void {
        this.hasMoved = true;

        this.selectionManager.selectRange(
            this.startRow,
            this.startColumn,
            context.cell.row,
            context.cell.column
        );

        this.autoScroller.updatePointer(context.event);

        this.renderer.render();
    }

    public onPointerUp(context: PointerContext): void {
        if(!this.hasMoved){
            this.selectionManager.selectCell(
                context.cell.row,
                context.cell.column
            );

            this.inputBarHandler.startEditingCell(
                context.cell.row,
                context.cell.column
            );
        }
        this.autoScroller.stopAutoScroll();
        this.renderer.render();
    }

}