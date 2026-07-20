import { MouseHitTester } from "./MouseHitTester";

export class CursorHandler {

    constructor(
        private canvas: HTMLCanvasElement,
        private hitTester: MouseHitTester
    ) { }

    public updateCursor(
        event: MouseEvent
    ): void {

        const resizeTarget =
            this.hitTester.getResizeTarget(event);

        if (resizeTarget.mode === "row") {

            this.canvas.style.cursor = "row-resize";

        }
        else if (resizeTarget.mode === "column") {

            this.canvas.style.cursor = "col-resize";

        }
        else {

            this.canvas.style.cursor = "default";

        }

    }

}
