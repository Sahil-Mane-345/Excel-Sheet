import type { CellEditor } from "../../Grid/CellEditor";
import { Selection, SelectionType, type SelectionManager } from "../../Grid/SelectionManager";
import type { Renderer } from "../../Renderer/Renderer";

export class InputColorSelector{

    private inputColorSelector: HTMLInputElement;

    constructor(
        private renderer: Renderer,
        private cellEditor: CellEditor,
        private selectionManager: SelectionManager
    ){
        this.inputColorSelector = document.getElementById("cell-bg-color") as HTMLInputElement;
    }

    public initialise(){
        
        this.inputColorSelector.addEventListener("input", () => {
            const selection : Selection = this.selectionManager.getSelection();
            
            if(selection){
                const startRow = Math.min(selection.startRow, selection.endRow);
                const endRow = Math.max(selection.startRow, selection.endRow);

                const startCol = Math.min(selection.startColumn, selection.endColumn);
                const endCol = Math.max(selection.startColumn, selection.endColumn);

                for(let i = startRow; i <= endRow; i++){
                    for(let j = startCol; j <= endCol; j++){
                        this.cellEditor.setColor(i, j, this.inputColorSelector.value);
                    }
                }
            }
            this.renderer.render();
        });
    }   
        

}