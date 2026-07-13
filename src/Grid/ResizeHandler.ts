
import { DEFAULT_COLUMN_WIDTH, DEFAULT_ROW_HEIGHT,  } from "../Utils/Constants";


export class ResizeHandler {
    private readonly rowHeights = new Map<number, number>();

    private readonly columnWidths = new Map<number, number>();

    public getRowHeight(
    row: number
): number {

    return (
        this.rowHeights.get(row) ??
        DEFAULT_ROW_HEIGHT
    );

}

public setRowHeight(
    row: number,
    height: number
): void {

    this.rowHeights.set(
        row,
        height
    );

}

public getColumnWidth(
    column: number
): number {

    return (
        this.columnWidths.get(column) ??
        DEFAULT_COLUMN_WIDTH
    );

}

public setColumnWidth(
    column: number,
    width: number
): void {

    this.columnWidths.set(
        column,
        width
    );

}

public hasCustomRowHeight(
    row: number
): boolean {

    return this.rowHeights.has(row);

}

public hasCustomColumnWidth(
    column: number
): boolean {

    return this.columnWidths.has(column);

}


}