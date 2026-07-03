import type { Cell } from "./Cell";

export class Sheet{

    private cells: Map<string,Cell>;

    private selectedRow: number = 0;
    private selectedCol: number = 0;

    private scrollX:number = -1;
    private scrollY:number = -1;

    private readonly cellWidth   = 120;
    private readonly cellHeight = 30;

    private readonly totalRows = 100000;
    private readonly totalCols = 500;


    private readonly rowHeaderWidth = 60;
    private readonly columnHeaderHeight = 30;

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D | null;

    constructor(canvas:HTMLCanvasElement ){
        this.cells = new Map();
        this.scrollX = 0;
        this.scrollY = 0;
        this.canvas = canvas ;
            this.context= canvas.getContext("2d");
            console.log("constructore");
            this.initialise();
            console.log("inittiali");
    }

    initialise(){
        const scrollSpace = document.getElementById("scroll-space") as HTMLElement;
        
        scrollSpace.style.width = `${this.totalCols * this.cellWidth}px`;
        scrollSpace.style.height = `${this.totalRows * this.cellHeight}px`;
        
        const scrollContainer = document.getElementById("sheet-container") as HTMLElement;
        this.canvas.width = scrollContainer.clientWidth;
        this.canvas.height = scrollContainer.clientHeight;

        const input = document.getElementById("cell-input-bar") as HTMLInputElement;
        input.addEventListener("input", ()=>{
            this.setCell(this.selectedRow, this.selectedCol, input.value);
            this.render();
        })
        scrollContainer.addEventListener("scroll", () => {
            this.scrollX = scrollContainer.scrollLeft;
            this.scrollY = scrollContainer.scrollTop;
            this.render();
        })
        

        this.canvas.addEventListener("click", (e) => {
            this.handleCallSelection(e)
        });

        this.render();
        
    }

    render(){
        console.log("render");
        const firstRow = Math.floor(this.scrollY / this.cellHeight);
        const firstCol = Math.floor(this.scrollX / this.cellWidth);
        const visibleRows = Math.floor(this.canvas.height / this.cellHeight);
        const visibleCols = Math.floor(this.canvas.width / this.cellWidth);
        this.context?.clearRect(0,0,this.canvas.width, this.canvas.height);
        const columnOffset = this.scrollX % this.cellWidth;
        const rowOffset = this.scrollY % this.cellHeight;
        
        for(var i = firstRow; i < firstRow + visibleRows + 1; i++){
            for(var j = firstCol ; j < firstCol + visibleCols + 1; j++){
                if(!this.context){
                    throw new Error("Context is null");
                }

                
                
                this.context.lineWidth = 1;
                this.context.strokeStyle = "#cdcdcd";
                
                
                const x = this.rowHeaderWidth + (j - firstCol) * this.cellWidth - columnOffset;
                
                const y = this.columnHeaderHeight + (i - firstRow) * this.cellHeight - rowOffset;
                if( i === this.selectedRow && j === this.selectedCol){
                    this.context.lineWidth = 2;
                    this.context.strokeStyle = "#090080";
                }
                this.context?.strokeRect(x, y, this.cellWidth, this.cellHeight);
                const cell = this.getCell(i , j);

                if(cell){
                    this.context.textAlign = "left";
                    this.context.textBaseline = "middle";
                    this.context.fillStyle = "black";
                    this.context.font = "14px Arial";

                    this.context.fillText(cell.value.substring(0,15), x + 5, y + 20);
                }
            }
        }
        this.renderRowHeaders(
            firstRow,
            visibleRows,
            rowOffset
        );

        this.renderColumnHeaders(
            firstCol,
            visibleCols,
            columnOffset
        );

        this.renderCorner();
    }

    handleCallSelection(event:MouseEvent){
        const rect = this.canvas.getBoundingClientRect();

        const mouseX = event.clientX - rect.left - this.rowHeaderWidth;
        const mouseY = event.clientY - rect.top - this.columnHeaderHeight;

        if(mouseX < 0 || mouseY < 0){
            return;
        }

        const actualX = mouseX + this.scrollX;
        const actualY = mouseY + this.scrollY;

        this.selectedCol = Math.floor(actualX / this.cellWidth);

        this.selectedRow = Math.floor(actualY / this.cellHeight);

        

        const input = document.getElementById("cell-input-bar") as HTMLInputElement;
        const label = document.getElementById("cell-input-label") as HTMLLabelElement;

        label.textContent = `${this.selectedRow} : ${this.getColumnName(this.selectedCol)}`;
        const cell = this.getCell(this.selectedRow, this.selectedCol);

        input.value = cell ? cell.value : "";
        this.render();
    }

    private getCellKey(row:number, column:number){
        return `${row}:${column}`;
    }

    private getCell(row : number, column : number): Cell | undefined{
        return this.cells.get(this.getCellKey(row, column));
    }

    private setCell(row:number, column: number, value: string){
        const key = this.getCellKey(row, column);

        if(value.trim() === ""){
            this.cells.delete(key);
            return;
        }
        this.cells.set(key, {value});
    }

    private getColumnName(column:number){
        let columnName = "";
        column ++;

        while(column > 0 ){
            const remainder = (column - 1) % 26;
            columnName = String.fromCharCode(65+remainder) + columnName;
            column = Math.floor((column - 1)/26);
        }
        return columnName;
    }

    private renderColumnHeaders(
    firstCol: number,
    visibleCols: number,
    columnOffset: number
                ): void {

            if (!this.context) {
                return;
            }

            for (
                let column = firstCol;
                column < firstCol + visibleCols + 1;
                column++
            ) {

                const x =
                    this.rowHeaderWidth +
                    (column - firstCol) * this.cellWidth -
                    columnOffset;

                this.context.fillStyle = "#f3f3f3";

                this.context.fillRect(
                    x,
                    0,
                    this.cellWidth,
                    this.columnHeaderHeight
                );

                this.context.strokeStyle = "#cdcdcd";

                this.context.strokeRect(
                    x,
                    0,
                    this.cellWidth,
                    this.columnHeaderHeight
                );

                this.context.fillStyle = "black";
                this.context.font = "14px Arial";
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";

                this.context.fillText(
                    this.getColumnName(column),
                    x + this.cellWidth / 2,
                    this.columnHeaderHeight / 2
                );

            }

        }

        private renderRowHeaders(
            firstRow: number,
            visibleRows: number,
            rowOffset: number
        ): void {

            if (!this.context) {
                return;
            }

            for (
                let row = firstRow;
                row < firstRow + visibleRows + 1;
                row++
            ) {

                const y =
                    this.columnHeaderHeight +
                    (row - firstRow) * this.cellHeight -
                    rowOffset;

                this.context.fillStyle = "#f3f3f3";

                this.context.fillRect(
                    0,
                    y,
                    this.rowHeaderWidth,
                    this.cellHeight
                );

                this.context.strokeStyle = "#cdcdcd";

                this.context.strokeRect(
                    0,
                    y,
                    this.rowHeaderWidth,
                    this.cellHeight
                );

                this.context.fillStyle = "black";
                this.context.font = "14px Arial";
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";

                this.context.fillText(
                    String(row + 1),
                    this.rowHeaderWidth / 2,
                    y + this.cellHeight / 2
                );

            }

        }

        private renderCorner(): void {

            if (!this.context) {
                return;
            }

            this.context.fillStyle = "#f3f3f3";

            this.context.fillRect(
                0,
                0,
                this.rowHeaderWidth,
                this.columnHeaderHeight
            );

            this.context.strokeStyle = "#cdcdcd";

            this.context.strokeRect(
                0,
                0,
                this.rowHeaderWidth,
                this.columnHeaderHeight
            );

        }

        }