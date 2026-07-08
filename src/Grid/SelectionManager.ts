// src/Grid/SelectionManager.ts

export enum SelectionType {
    Cell,
    Range,
    Row,
    Column,
    All
}

export class Selection {

    constructor(
        public type: SelectionType,
        public startRow: number,
        public startColumn: number,
        public endRow: number,
        public endColumn: number
    ) {}

}

export class SelectionManager {

    private selection = new Selection(
        SelectionType.Cell,
        0,
        0,
        0,
        0
    );

    public selectCell(
        row: number,
        column: number
    ): void {

        this.selection = new Selection(
            SelectionType.Cell,
            row,
            column,
            row,
            column
        );

    }

    public selectRange(
        startRow: number,
        startColumn: number,
        endRow: number,
        endColumn: number
    ): void {

        this.selection = new Selection(
            SelectionType.Range,
            startRow,
            startColumn,
            endRow,
            endColumn
        );

    }

    public selectRows(
        startRow: number,
        endRow: number,
        totalColumns: number
    ): void {

        this.selection = new Selection(
            SelectionType.Row,
            startRow,
            0,
            endRow,
            totalColumns - 1
        );

    }

    public selectColumns(
        startColumn: number,
        endColumn: number,
        totalRows: number
    ): void {

        this.selection = new Selection(
            SelectionType.Column,
            0,
            startColumn,
            totalRows - 1,
            endColumn
        );

    }

    public selectAll(
        totalRows: number,
        totalColumns: number
    ): void {

        this.selection = new Selection(
            SelectionType.All,
            0,
            0,
            totalRows - 1,
            totalColumns - 1
        );

    }

    public clear(): void {

        this.selection = new Selection(
            SelectionType.Cell,
            0,
            0,
            0,
            0
        );

    }

    public getSelection(): Selection {

        return this.selection;

    }

    public getSelectedRow(): number {

        return this.selection.startRow;

    }

    public getSelectedColumn(): number {

        return this.selection.startColumn;

    }

}

