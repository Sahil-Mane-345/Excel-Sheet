import { SelectionManager } from '../../../Grid/SelectionManager';
import type { Viewport } from "../../../Grid/Viewport";
import type { Renderer } from "../../../Renderer/Renderer";
import type { UndoRedoHandler } from "../../Commands/UndoRedoHandler";
import type { InputBarHandler } from "../../Input/InputBarHandler";
import type { PointerContextFactory } from "./PointerContextFactory";
import { PointerDispatcher } from "./PointerDispatcher";
import { ColumnResizeHandler } from "./Resize/ColumnResizeHandler";
import { RowResizeHandler } from "./Resize/RowResizeHandler";
import { CellSelectionHandler } from "./Selection/CellSelectionHandler";
import { ColumnSelectionHandler } from "./Selection/ColumnSelectionHandler";
import { RowSelectionHandler } from "./Selection/RowSelectionHandler";
import { SelectAllHandler } from "./Selection/SelectAllHandler";
import { ScrollSpaceManager } from '../../../Renderer/ScrollSpaceManager';
import type { CursorHandler } from "../CursorHandler";
import type { AutoScroller } from '../AutoScroller';

export class PointerEventHandler {

    private dispatcher: PointerDispatcher;


    constructor(
        private canvas: HTMLCanvasElement,
        private contextFactory: PointerContextFactory,
        private inputBarHandler: InputBarHandler,
        private viewport: Viewport,
        private renderer: Renderer,
        private cursorHanlder: CursorHandler,
        private undoRedoHandler: UndoRedoHandler, 
        private scrollSpaceManager: ScrollSpaceManager,
        private selectionManager: SelectionManager,
        private autoScroller: AutoScroller
    ){

        const rowResize = new RowResizeHandler(this.viewport, this.renderer, this.undoRedoHandler, this.scrollSpaceManager);
        const columnResize = new ColumnResizeHandler(this.viewport, this.renderer, this.undoRedoHandler, this.scrollSpaceManager);

        const cellSelection = new CellSelectionHandler(this.inputBarHandler, this.renderer, this.selectionManager, this.autoScroller);
        const rowSelection = new RowSelectionHandler(this.viewport, this.renderer, this.selectionManager);
        const columnSelection = new ColumnSelectionHandler(this.viewport, this.renderer, this.selectionManager);
        const allSelection = new SelectAllHandler(this.viewport, this.renderer, this.selectionManager);

        rowResize.setNext(columnResize).setNext(allSelection).setNext(rowSelection).setNext(columnSelection).setNext(cellSelection);
        this.dispatcher = new PointerDispatcher(rowResize);
        
    }

    public register(): void{
        
        this.canvas.addEventListener("pointerdown", this.handlePointerDown.bind(this));

        this.canvas.addEventListener("pointermove", this.handlePointerMove.bind(this));

        this.canvas.addEventListener("pointerup", this.handlePointerUp.bind(this));

    }

    private handlePointerDown(
        event: PointerEvent
    ): void{
        this.inputBarHandler.commitInputCommand();

        const context = this.contextFactory.create(event);
        this.dispatcher.pointerDown(context);


    };

    private handlePointerMove(
        event: PointerEvent
    ): void{
        const context = this.contextFactory.create(event);
        this.cursorHanlder.updateCursor(event);
        this.dispatcher.pointerMove(context);

    }

    private handlePointerUp(
        event: PointerEvent
    ): void{
        const context = this.contextFactory.create(event);
        this.dispatcher.pointerUp(context);
    }

}