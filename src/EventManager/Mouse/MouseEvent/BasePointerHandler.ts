import type { PointerHandler } from "./PointerHandler";
import type { PointerContext } from "./PointerContext";

export abstract class BasePointerHandler implements PointerHandler{

    private next? : PointerHandler;

    setNext(hanlder: PointerHandler): PointerHandler {
        this.next = hanlder;
        return this.next;
    }

    getNext(): PointerHandler | undefined {
        return this.next;
    };

    public abstract canHandle(context: PointerContext): boolean;

    public abstract onPointerDown(context: PointerContext): void;

    public abstract onPointerMove(context: PointerContext): void;

    public abstract onPointerUp(context: PointerContext): void;
}