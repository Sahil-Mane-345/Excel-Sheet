import type { MouseHitTester } from "../MouseHitTester";
import type { PointerContext } from "./PointerContext";

export class PointerContextFactory{
    constructor(private hitTester: MouseHitTester){}

    public create(
        event: PointerEvent
    ): PointerContext{
        return {
            event,
            cell : this.hitTester.getCellFromMouse(event),
            resizeTarget: this.hitTester.getResizeTarget(event)
        };
    }
}