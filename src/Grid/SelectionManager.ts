// src/Grid/SelectionManager.ts

import { CellRange } from "../Model/CellRange";

export class SelectionManager {

    private selectedRow = 0;

    private selectedColumn = 0;

    private selectedRange: CellRange | null = null;

    private selectedRows = new Set<number>();

    private selectedColumns = new Set<number>();

    public selectCell(
        row: number,
        column: number
    ): void {

        this.selectedRow = row;
        this.selectedColumn = column;

        this.selectedRange = null;

        this.selectedRows.clear();

        this.selectedColumns.clear();

    }

    public selectRow(row: number): void {

        this.selectedRows.clear();

        this.selectedColumns.clear();

        this.selectedRange = null;

        this.selectedRows.add(row);

    }

    public selectColumn(column: number): void {

        this.selectedRows.clear();

        this.selectedColumns.clear();

        this.selectedRange = null;

        this.selectedColumns.add(column);

    }

    public selectRange(
        startRow: number,
        startColumn: number,
        endRow: number,
        endColumn: number
    ): void {

        this.selectedRange = new CellRange(
            startRow,
            startColumn,
            endRow,
            endColumn
        );

    }

    public clear(): void {

        this.selectedRows.clear();

        this.selectedColumns.clear();

        this.selectedRange = null;

    }

    public getSelectedRow(): number {

        return this.selectedRow;

    }

    public getSelectedColumn(): number {

        return this.selectedColumn;

    }

    public getSelectedRange(): CellRange | null {

        return this.selectedRange;

    }

    public getSelectedRows(): Set<number> {

        return this.selectedRows;

    }

    public getSelectedColumns(): Set<number> {

        return this.selectedColumns;

    }

}