import { MouseHitTester } from "./Mouse/MouseHitTester";
import { CursorHandler } from "./Mouse/CursorHandler";
import { AutoScroller } from "./Mouse/AutoScroller";
import { ResizeHandler } from "./Mouse/ResizeHandler";
import { SelectionHandler } from "./Mouse/SelectionHandler";
import { MouseEventHandler } from "./Mouse/MouseEventHandler";
import { KeyboardHandler } from "./Keyboard/KeyboardHandler";
import { InputBarHandler } from "./Input/InputBarHandler";
import { FileHandler } from "./Input/FileHandler";
import { UndoRedoHandler } from "./Commands/UndoRedoHandler";
import { ScrollSpaceManager } from "../Renderer/ScrollSpaceManager";
import type { Renderer } from "../Renderer/Renderer";
import type { Viewport } from "../Grid/Viewport";
import type { SelectionManager } from "../Grid/SelectionManager";
import type { CellEditor } from "../Grid/CellEditor";

export class EventManager {

    private undoRedoHandler: UndoRedoHandler;

    private scrollSpaceManager: ScrollSpaceManager;

    private inputBarHandler: InputBarHandler;

    private fileHandler: FileHandler;

    private hitTester: MouseHitTester;

    private cursorHandler: CursorHandler;

    private autoScroller: AutoScroller;

    private resizeHandler: ResizeHandler;

    private selectionHandler: SelectionHandler;

    private mouseEventHandler: MouseEventHandler;

    private keyboardHandler: KeyboardHandler;

    constructor(
        private canvas: HTMLCanvasElement,
        private renderer: Renderer,
        private viewport: Viewport,
        private selectionManager: SelectionManager,
        private cellEditor: CellEditor
    ) {

        this.undoRedoHandler = new UndoRedoHandler();

        this.scrollSpaceManager = new ScrollSpaceManager(
            this.viewport,
            this.renderer
        );

        this.inputBarHandler = new InputBarHandler(
            this.renderer,
            this.cellEditor,
            this.undoRedoHandler
        );

        this.fileHandler = new FileHandler(
            this.cellEditor,
            this.renderer
        );


        this.hitTester = new MouseHitTester(
            this.canvas,
            this.viewport
        );

        this.cursorHandler = new CursorHandler(
            this.canvas,
            this.hitTester
        );

        this.autoScroller = new AutoScroller(
            this.canvas,
            this.scrollSpaceManager.getScrollContainer()
        );

        this.resizeHandler = new ResizeHandler(
            this.viewport,
            this.renderer,
            this.undoRedoHandler,
            this.scrollSpaceManager
        );

        this.selectionHandler = new SelectionHandler(
            this.viewport,
            this.renderer,
            this.selectionManager,
            this.hitTester,
            this.inputBarHandler,
            // this.styleHandler
        );

        this.mouseEventHandler = new MouseEventHandler(
            this.canvas,
            this.hitTester,
            this.resizeHandler,
            this.selectionHandler,
            this.cursorHandler,
            this.autoScroller,
            this.inputBarHandler
        );

        this.keyboardHandler = new KeyboardHandler(
            this.renderer,
            this.undoRedoHandler,
            this.inputBarHandler
        );

    }

    public initialise(): void {

        this.scrollSpaceManager.register();

        this.mouseEventHandler.register();

        this.keyboardHandler.register();

        this.inputBarHandler.register();

        this.fileHandler.register();

        this.scrollSpaceManager.sync();

    }

    public importSheet(json: string): void {
        this.fileHandler.importSheet(json);
    }

}
