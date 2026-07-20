// src/Grid/Utils/ScrollSpaceManager.ts

import type { Viewport } from "../Grid/Viewport";
import type { Renderer } from "./Renderer";



/**
 * Owns the scroll container / scroll-space DOM elements: keeps the
 * spacer sized to the full sheet dimensions, and forwards native
 * scroll events into the Viewport.
 */
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
