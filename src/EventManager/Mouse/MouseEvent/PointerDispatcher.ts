import type { PointerHandler } from "./PointerHandler";
import type { PointerContext } from "./PointerContext";

export class PointerDispatcher {

    private activeHandler?: PointerHandler;

    constructor(
        private firstHandler: PointerHandler
    ){}

    public pointerDown(context:PointerContext): void{
        const handler = this.findHandler(context);
        if(!handler){
            return;
        }

        this.activeHandler = handler;

        this.activeHandler.onPointerDown(context);
    }

    public pointerMove(context: PointerContext): void{
        if(!this.activeHandler){
            return;
        }

        this.activeHandler.onPointerMove(context)
    }

    public pointerUp(context: PointerContext): void{
        if(!this.activeHandler){
            return;
        }

        this.activeHandler.onPointerUp(context);
        this.activeHandler = undefined;
    }

    private findHandler(context: PointerContext): PointerHandler | undefined {
        let current: PointerHandler | undefined = this.firstHandler;

        while(current){
            if(current.canHandle(context)){
                return current;
            }

            current = current.getNext();
        }

        return undefined;
    }

    public clear():void{
        this.activeHandler = undefined;
    }

    public hasActiveHandler(): boolean{
        return this.activeHandler !== undefined;
    }

    public getActiveHandler(): PointerHandler | undefined {
        return this.activeHandler;
    }
}