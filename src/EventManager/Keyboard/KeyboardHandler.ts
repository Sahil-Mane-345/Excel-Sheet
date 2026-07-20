import type { Renderer } from "../../Renderer/Renderer";
import { UndoRedoHandler } from "../Commands/UndoRedoHandler";
import { InputBarHandler } from "../Input/InputBarHandler";


export class KeyboardHandler {

    constructor(
        private renderer: Renderer,
        private undoRedoHandler: UndoRedoHandler,
        private inputBarHandler: InputBarHandler
    ) { }

    public register(): void {
        window.addEventListener("keydown", this.handleKeyboard);
    }

    private handleKeyboard = (event: KeyboardEvent): void => {
        const isUndo =
            (event.ctrlKey || event.metaKey) &&
            !event.shiftKey &&
            event.key.toLowerCase() === "z";

        const isRedo =
            (event.ctrlKey || event.metaKey) &&
            (event.key.toLowerCase() === "y" ||
                ((event.key.toLowerCase() === "z") && event.shiftKey));

        if (!isUndo && !isRedo) {
            return;
        }

        event.preventDefault();

        this.inputBarHandler.commitInputCommand();

        if (isUndo) {
            this.undoRedoHandler.undo();
        } else {
            this.undoRedoHandler.redo();
        }

        this.inputBarHandler.syncActiveInput();

        this.renderer.render();
    };

}
