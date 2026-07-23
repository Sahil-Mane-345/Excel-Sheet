import type { Renderer } from "../../Renderer/Renderer";
import { UndoRedoHandler } from "../Commands/UndoRedoHandler";
import { InputBarHandler } from "../Input/InputBarHandler";
import { SelectionManager } from '../../Grid/SelectionManager';
import { TOTAL_COLUMNS, TOTAL_ROWS } from '../../Utils/Constants';


export class KeyboardHandler {

    constructor(
        private renderer: Renderer,
        private undoRedoHandler: UndoRedoHandler,
        private selectionManager: SelectionManager,
        private inputBarHandler: InputBarHandler
    ) { }

    public register(): void {
        window.addEventListener("keydown", this.handleKeyboard);
    }

    private handleKeyboard = (event: KeyboardEvent): void => {

        if(this.handleSelectionMove(event)){
            this.renderer.render();
            return;
        }
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

    private handleSelectionMove(event:KeyboardEvent): boolean{
        const selection = this.selectionManager.getSelection();
        switch(event.key){
            case "ArrowUp":
                event.preventDefault();
                this.selectionMove(Math.max(0, selection.startRow - 1), selection.startColumn);
                return true;
            case "ArrowDown":
                event.preventDefault();
                this.selectionMove(Math.min(TOTAL_ROWS, selection.startRow + 1), selection.startColumn);
                return true;
            case "ArrowLeft":
                event.preventDefault();
                this.selectionMove(selection.startRow, Math.max(0, selection.startColumn - 1) );
                return true;
            case "ArrowRight":
                event.preventDefault();
                this.selectionMove(selection.startRow, Math.min(selection.startColumn + 1, TOTAL_COLUMNS));
                return true;
            case "Enter":
                event.preventDefault();
                this.selectionMove(selection.startRow, selection.startColumn);
                return true;
        }
        
        return false;
    }

    private selectionMove(row: number, col: number){
        this.selectionManager.selectCell(row, col);
        this.inputBarHandler.startEditingCell(row, col);
        this.inputBarHandler.commitInputCommand();
    }

}
