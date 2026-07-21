import type { CellHit, ResizeTarget } from "../MouseHitTester";

export interface PointerContext{
    event: PointerEvent;

    cell : CellHit;

    resizeTarget: ResizeTarget;
}