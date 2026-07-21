import type { SelectionManager } from "../../../../Grid/SelectionManager";
import type { Renderer } from "../../../../Renderer/Renderer";
import { BasePointerHandler } from "../BasePointerHandler";
import type { PointerContext } from "../PointerContext";
import { InputBarHandler } from '../../../Input/InputBarHandler';
import type { AutoScroller } from "../../AutoScroller";
import { Viewport } from '../../../../Grid/Viewport';

export class CellSelectionHandler extends BasePointerHandler {

    private startColumn: number = 0;

    private startRow: number = 0;

    private hasMoved: boolean = false;

    constructor(
        private inputBarHandler: InputBarHandler,
        private renderer: Renderer,
        private viewport: Viewport,
        private selectionManager: SelectionManager,
        private autoScroller: AutoScroller
    ){
        super();
    }

    public canHandle(context: PointerContext): boolean {
        return (!context.cell.isRowHeader && !context.cell.isColumnHeader) || context.cell.isCorner;
    }

    public onPointerDown(context: PointerContext): void {
        if(context.cell.isCorner){
            this.selectionManager.selectAll(this.viewport.getTotalRows(), this.viewport.getTotalColumns());
            this.renderer.render();
            return;
        }
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
        if(context.cell.isCorner){
            return;
        }
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
        if(context.cell.isCorner){
            return;
        }
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