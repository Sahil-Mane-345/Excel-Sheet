import type { Renderer } from "../../Renderer/Renderer";

export class AutoScroller {

    private static readonly AUTO_SCROLL_MARGIN = 20;

    private static readonly AUTO_SCROLL_SPEED = 3;

    private animationId?: number;

    private pointerEvent?: PointerEvent;

    private onFrame?: (event: PointerEvent) => void;

    constructor(
        private canvas: HTMLCanvasElement,
        private scrollContainer: HTMLDivElement,
        private renderer: Renderer
    ) { }

    public startAutoScroll(
        event: PointerEvent,
        onFrame: (event: PointerEvent) => void
    ): void {

        this.pointerEvent = event;
        this.onFrame = onFrame;

        if (this.animationId) {
            return;
        }

        const animate = () => {

            if (!this.pointerEvent) {
                return;
            }

            const rect =
                this.canvas.getBoundingClientRect();

            let scrollX =
                this.scrollContainer.scrollLeft;

            let scrollY =
                this.scrollContainer.scrollTop;

            let shouldScroll = false;

            if (
                this.pointerEvent.clientY <
                rect.top + AutoScroller.AUTO_SCROLL_MARGIN
            ) {
                scrollY -= AutoScroller.AUTO_SCROLL_SPEED;
                shouldScroll = true;
            }

            if (
                this.pointerEvent.clientY >
                rect.bottom - AutoScroller.AUTO_SCROLL_MARGIN
            ) {
                scrollY += AutoScroller.AUTO_SCROLL_SPEED;
                shouldScroll = true;
            }

            if (
                this.pointerEvent.clientX <
                rect.left + AutoScroller.AUTO_SCROLL_MARGIN
            ) {
                scrollX -= AutoScroller.AUTO_SCROLL_SPEED;
                shouldScroll = true;
            }

            if (
                this.pointerEvent.clientX >
                rect.right - AutoScroller.AUTO_SCROLL_MARGIN
            ) {
                scrollX += AutoScroller.AUTO_SCROLL_SPEED;
                shouldScroll = true;
            }

            if (shouldScroll) {

                this.scrollContainer.scrollTo({
                    left: Math.max(0, scrollX),
                    top: Math.max(0, scrollY)
                });

                this.onFrame?.(this.pointerEvent);

                this.renderer.render();
            }

            this.animationId =
                requestAnimationFrame(animate);
        };

        this.animationId =
            requestAnimationFrame(animate);
    }

    public updatePointer(
        event: PointerEvent
    ): void {

        this.pointerEvent = event;
    }

    public stopAutoScroll(): void {

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.animationId = undefined;
        this.pointerEvent = undefined;
        this.onFrame = undefined;
    }
}