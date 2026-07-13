
import { Viewport } from "../Grid/Viewport";
import type { Command } from "./Command";

export class ResizeCommand implements Command {

    constructor(
        private viewport: Viewport,
        private target: "row" | "column",
        private index: number,
        private previousSize: number,
        private newSize: number
    ) { }

    public execute(): void {
        if (this.target === "row") {
            this.viewport.setRowHeight(this.index, this.newSize);
        } else {
            this.viewport.setColumnWidth(this.index, this.newSize);
        }
    }

    public undo(): void {
        if (this.target === "row") {
            this.viewport.setRowHeight(this.index, this.previousSize);
        } else {
            this.viewport.setColumnWidth(this.index, this.previousSize);
        }
    }

}