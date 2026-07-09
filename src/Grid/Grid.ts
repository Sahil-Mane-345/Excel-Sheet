import { Renderer } from "./Renderer";
import { Viewport } from "./Viewport";
import { SelectionManager } from "./SelectionManager";
import { CellEditor } from "./CellEditor";
import { EventManager } from "./EventManager";


export class Grid {

    private renderer: Renderer;

    private viewport: Viewport;

    private selectionManager: SelectionManager;

    private cellEditor: CellEditor;

    private eventManager: EventManager;

    constructor(
        private canvas: HTMLCanvasElement
    ) {

        this.viewport = new Viewport();

        this.selectionManager = new SelectionManager();

        this.cellEditor = new CellEditor();

        this.renderer = new Renderer(
            this.canvas,
            this.viewport,
            this.selectionManager,
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

    public exportSheet(): string{
        return JSON.stringify({
            cells: this.cellEditor.exportCells()
        });
    }

    public importSheet(
        json:string
    ): void{
        const sheet = JSON.parse(json);
        this.cellEditor.loadRecords(sheet);
        this.renderer.render();
    }

}