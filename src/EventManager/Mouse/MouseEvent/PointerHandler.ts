import type { PointerContext } from "./PointerContext";

export interface PointerHandler{
    setNext(hanlder: PointerHandler): PointerHandler;

    getNext(): PointerHandler | undefined;

    canHandle(context:PointerContext): boolean;

    onPointerDown(context:PointerContext): void;

    onPointerMove(context:PointerContext): void;
    
    onPointerUp(context:PointerContext): void;

    
}