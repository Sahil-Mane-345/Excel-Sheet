import type { Viewport } from "../Grid/Viewport";
import type { Renderer } from "./Renderer";

export class ScrollSpaceManager {

    private scrollContainer: HTMLDivElement;

    private scrollSpace: HTMLDivElement;

    constructor(
        private viewport: Viewport,
        private renderer: Renderer
    ) {

        this.scrollContainer =
            document.getElementById(
                "sheet-container"
            ) as HTMLDivElement;

        this.scrollSpace =
            document.getElementById(
                "scroll-space"
            ) as HTMLDivElement;

    }

    public getScrollContainer(): HTMLDivElement {
        return this.scrollContainer;
    }

    public register(): void {
        this.scrollContainer.addEventListener("scroll", () => {
            this.viewport.setScroll(
                this.scrollContainer.scrollLeft,
                this.scrollContainer.scrollTop
            );

            this.renderer.render();
        });
    }

    public sync(): void {

        this.scrollSpace.style.width =
            `${this.viewport.getTotalSheetWidth()}px`;

        this.scrollSpace.style.height =
            `${this.viewport.getTotalSheetHeight()}px`;

    }

}
