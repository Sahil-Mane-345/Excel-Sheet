import { InputBarHandler } from "../Input/InputBarHandler";
import { MouseHitTester } from "./MouseHitTester";
import { ResizeHandler } from "./ResizeHandler";
import { SelectionHandler } from "./SelectionHandler";
import { CursorHandler } from "./CursorHandler";
import { AutoScroller } from "./AutoScroller";

export class MouseEventHandler {

    constructor(
        private canvas: HTMLCanvasElement,
        private hitTester: MouseHitTester,
        private resizeHandler: ResizeHandler,
        private selectionHandler: SelectionHandler,
        private cursorHandler: CursorHandler,
        private autoScroller: AutoScroller,
        private inputBarHandler: InputBarHandler
    ) { }

    public register(): void {
        this.canvas.addEventListener("pointerdown", this.handleMouseDown);
        window.addEventListener("pointermove", this.handleMouseMove);
        window.addEventListener("pointerup", this.handleMouseUp);
    }

    private handleMouseDown = (
        event: MouseEvent
    ): void => {

        this.inputBarHandler.commitInputCommand();

        const resizeTarget =
            this.hitTester.getResizeTarget(event);

        if (resizeTarget.mode) {

            this.resizeHandler.startResize(event, resizeTarget);

            event.preventDefault();

            return;

        }

        const cell = this.hitTester.getCellFromMouse(event);

        if (!cell) {
            return;
        }

        this.selectionHandler.startDrag(cell);

    };

    private handleMouseMove = (
        event: MouseEvent
    ): void => {

        if (this.resizeHandler.isActive()) {

            this.resizeHandler.onMouseMove(event);

            return;

        }

        this.cursorHandler.updateCursor(event);

        if (!this.selectionHandler.isActive()) {
            return;
        }

        this.autoScroller.autoScroll(event);

        this.selectionHandler.onMouseMove(event);

    };

    private handleMouseUp = (
        event: MouseEvent
    ): void => {

        if (this.resizeHandler.isActive()) {

            this.resizeHandler.onMouseUp();

            return;

        }

        if (!this.selectionHandler.isActive()) {
            return;
        }

        this.selectionHandler.onMouseUp(event);

    };

}
