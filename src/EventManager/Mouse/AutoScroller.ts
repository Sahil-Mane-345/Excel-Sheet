export class AutoScroller {

    private static readonly AUTO_SCROLL_MARGIN = 20;

    private static readonly AUTO_SCROLL_SPEED = 20;

    constructor(
        private canvas: HTMLCanvasElement,
        private scrollContainer: HTMLDivElement
    ) { }

    public autoScroll(
        event: MouseEvent
    ): void {

        const rect =
            this.canvas.getBoundingClientRect();

        let scrollX =
            this.scrollContainer.scrollLeft;

        let scrollY =
            this.scrollContainer.scrollTop;

        if (
            event.clientY <
            rect.top +
            AutoScroller.AUTO_SCROLL_MARGIN
        ) {

            scrollY -=
                AutoScroller.AUTO_SCROLL_SPEED;

        }

        if (
            event.clientY >
            rect.bottom -
            AutoScroller.AUTO_SCROLL_MARGIN
        ) {

            scrollY +=
                AutoScroller.AUTO_SCROLL_SPEED;

        }

        if (
            event.clientX <
            rect.left +
            AutoScroller.AUTO_SCROLL_MARGIN
        ) {

            scrollX -=
                AutoScroller.AUTO_SCROLL_SPEED;

        }

        if (
            event.clientX >
            rect.right -
            AutoScroller.AUTO_SCROLL_MARGIN
        ) {

            scrollX +=
                AutoScroller.AUTO_SCROLL_SPEED;

        }

        this.scrollContainer.scrollTo({

            left: Math.max(0, scrollX),

            top: Math.max(0, scrollY)

        });

    }

}
