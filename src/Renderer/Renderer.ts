import type { CellEditor } from "../Grid/CellEditor";
import { SelectionType, type SelectionManager } from "../Grid/SelectionManager";
import type { SelectionStatsManager } from "../Grid/SelectionStatsManager";
import type { Viewport } from "../Grid/Viewport";
import { GridDrawer } from "./GridDrawer";
import { GridGeometry } from "./GridGeometry";
import { HeaderDrawer } from "./HeaderDrawer";
import { SelectionDrawer } from "./SelectionDrawer";
import { StatusBarDrawer } from "./StatusBarDrawer";

export class Renderer {

    private context: CanvasRenderingContext2D;

    private geometry: GridGeometry;

    private gridDrawer: GridDrawer;

    private headerDrawer: HeaderDrawer;

    private selectionDrawer: SelectionDrawer;

    private statusBarDrawer: StatusBarDrawer;

    constructor(
        private canvas: HTMLCanvasElement,
        private viewport: Viewport,
        private selectionManager: SelectionManager,
        private selectionStatsManager: SelectionStatsManager,
        private cellEditor: CellEditor
    ) {

        const context = this.canvas.getContext("2d");

        if (!context) {
            throw new Error("Unable to get canvas context.");
        }

        this.context = context;

        this.geometry = new GridGeometry(this.viewport);

        this.gridDrawer = new GridDrawer(
            this.context,
            this.viewport,
            this.cellEditor,
            this.geometry
        );

        this.headerDrawer = new HeaderDrawer(
            this.context,
            this.viewport,
            this.selectionManager,
            this.geometry
        );

        this.selectionDrawer = new SelectionDrawer(
            this.context,
            this.canvas,
            this.viewport,
            this.selectionManager,
            this.geometry
        );

        this.statusBarDrawer = new StatusBarDrawer(
            this.context,
            this.canvas,
            this.selectionManager,
            this.selectionStatsManager,
            this.cellEditor
        );

    }

    public render(): void {

        const viewport = this.viewport.getViewport(
            this.canvas.width,
            this.canvas.height
        );

        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.selectionDrawer.drawSelection(viewport);

        this.gridDrawer.drawCellBackgrounds(viewport);

        this.gridDrawer.drawGrid(viewport);

        this.gridDrawer.drawCells(viewport);

        this.headerDrawer.drawRowHeaders(viewport);

        this.headerDrawer.drawColumnHeaders(viewport);

        this.headerDrawer.drawCorner();

        if (this.selectionManager.getSelection().type != SelectionType.All) {
            this.statusBarDrawer.drawSelectionStats();
        }

    }

}
