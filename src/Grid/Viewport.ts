import { ResizeHandler } from './ResizeHandler';
import {
    TOTAL_ROWS,
    TOTAL_COLUMNS,
    DEFAULT_ROW_HEIGHT,
    DEFAULT_COLUMN_WIDTH,
    ROW_HEADER_WIDTH,
    COLUMN_HEADER_HEIGHT
} from "../Utils/Constants";

export class Viewport {

    private scrollX = 0;

    private scrollY = 0;

    constructor( private resizeHandler:ResizeHandler){

    }

    public setScroll(
        scrollX: number,
        scrollY: number
    ): void {

        this.scrollX = scrollX;
        this.scrollY = scrollY;

    }

    public getScrollX(): number {

        return this.scrollX;

    }

    public getScrollY(): number {

        return this.scrollY;

    }

    public getTotalRows(): number {

        return TOTAL_ROWS;

    }

    public getTotalColumns(): number {

        return TOTAL_COLUMNS;

    }

    public getDefaultRowHeight(): number {

        return DEFAULT_ROW_HEIGHT;

    }

    public getDefaultColumnWidth(): number {

        return DEFAULT_COLUMN_WIDTH;

    }

    public getRowHeaderWidth(): number {

        return ROW_HEADER_WIDTH;

    }

    public getColumnHeaderHeight(): number {

        return COLUMN_HEADER_HEIGHT;

    }

    public getViewport(
        canvasWidth: number,
        canvasHeight: number
    ) {

        // let height = 0;
        let width = 0;

        // for(var i = 0; i < TOTAL_ROWS; i++){
        //     if(height < this.scrollY){
        //         height += this.resizeHandler.getRowHeight(i);
        //     }
        // }
        for(var j = 0; j < TOTAL_COLUMNS; j++){
            if(width >= this.scrollX){
                break;
            }
            width += this.resizeHandler.getColumnWidth(j);
        }
        
        // console.log("height : " + height + " i : " + i  +" scrollY : " + this.scrollY );

        console.log("width : " + width + " j : " + j+" scrollX : " + this.scrollX );



        const firstRow =
            Math.floor(
                this.scrollY /
                DEFAULT_ROW_HEIGHT
            );

        const firstColumn =
            Math.floor(
                this.scrollX /
                DEFAULT_COLUMN_WIDTH
            );

        const visibleRows =
            Math.ceil(
                canvasHeight /
                DEFAULT_ROW_HEIGHT
            ) + 1;

        const visibleColumns =
            Math.ceil(
                canvasWidth /
                DEFAULT_COLUMN_WIDTH
            ) + 1;

        return {

            firstRow,

            firstColumn,

            visibleRows,

            visibleColumns,

            rowOffset:
                this.scrollY %
                DEFAULT_ROW_HEIGHT,

            columnOffset:
                this.scrollX %
                DEFAULT_COLUMN_WIDTH

        };

    }

}