// src/Grid/Rendering/StatusBarDrawer.ts

import type { CellEditor } from "../Grid/CellEditor";
import type { SelectionManager } from "../Grid/SelectionManager";
import type { SelectionStatsManager } from "../Grid/SelectionStatsManager";


/**
 * Draws the status bar showing count/sum/average/min/max for the
 * current selection.
 */
export class StatusBarDrawer {

    private readonly statusBarHeight = 24;

    constructor(
        private context: CanvasRenderingContext2D,
        private canvas: HTMLCanvasElement,
        private selectionManager: SelectionManager,
        private selectionStatsManager: SelectionStatsManager,
        private cellEditor: CellEditor
    ) { }

    public drawSelectionStats(): void {

        const stats = this.selectionStatsManager.calculate(
            this.selectionManager.getSelection(),
            this.cellEditor
        );

        const y = this.canvas.height - this.statusBarHeight;

        this.context.fillStyle = "#f3f3f3";
        this.context.fillRect(
            0,
            y - 10,
            this.canvas.width,
            this.statusBarHeight
        );

        this.context.strokeStyle = "#d0d0d0";
        this.context.beginPath();
        this.context.moveTo(0, y - 10);
        this.context.lineTo(this.canvas.width, y - 10);
        this.context.stroke();

        this.context.fillStyle = "#333";
        this.context.font = "13px Arial";
        this.context.textAlign = "left";
        this.context.textBaseline = "middle";

        const text =
            `Count: ${stats.cellCount}    ` +
            `Sum: ${stats.sum}    ` +
            `Avg: ${stats.average.toFixed(2)}    ` +
            `Min: ${stats.min ?? "-"}    ` +
            `Max: ${stats.max ?? "-"}`;

        this.context.fillText(
            text,
            8,
            (y + this.statusBarHeight / 2) - 10
        );

    }

}
