
import { Viewport } from "./Viewport";
import { SelectionManager } from "./SelectionManager";
import { CellEditor } from "./CellEditor";

import { SelectionStatsManager } from "./SelectionStatsManager";
import { Renderer } from "../Renderer/Renderer";
import { EventManager } from "../EventManager/EventManager";




export class Grid {

    private renderer: Renderer;

    private viewport: Viewport;

    private selectionManager: SelectionManager;

    private cellEditor: CellEditor;

    private eventManager: EventManager;

    private selectionStatsManager: SelectionStatsManager;

    


    constructor(
        private canvas: HTMLCanvasElement
    ) {

        this.viewport = new Viewport();

        this.selectionManager = new SelectionManager();

        this.cellEditor = new CellEditor();

        this.selectionStatsManager = new SelectionStatsManager();


        this.renderer = new Renderer(
            this.canvas,
            this.viewport,
            this.selectionManager,
            this.selectionStatsManager,
            this.cellEditor
        );

        this.eventManager = new EventManager(
            this.canvas,
            this.renderer,
            this.viewport,
            this.selectionManager,
            this.cellEditor
        );

    }

    public initialise(): void {

        const container = document.getElementById(
            "sheet-container"
        ) as HTMLDivElement;

        const scrollSpace = document.getElementById(
            "scroll-space"
        ) as HTMLDivElement;

        this.canvas.width = container.clientWidth;

        this.canvas.height = container.clientHeight;

        scrollSpace.style.width =
            `${this.viewport.getTotalColumns() * this.viewport.getDefaultColumnWidth()}px`;

        scrollSpace.style.height =
            `${this.viewport.getTotalRows() * this.viewport.getDefaultRowHeight()}px`;

        this.eventManager.initialise();

        this.renderer.render();

    }

}