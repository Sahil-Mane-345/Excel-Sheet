import type { Cell } from "../Model/Cell";
import { Helpers } from "../Utils/Helpers";


export class CellEditor {

    private cells = new Map<string, Cell>();

    public getCell(
        row: number,
        column: number
    ): Cell | undefined {

        return this.cells.get(
            Helpers.getCellKey(row, Helpers.getColumnName(column))
        );

    }

    public setCell(
        row: number,
        column: number,
        value: string
    ): void {

        const key = Helpers.getCellKey(
            row,
            Helpers.getColumnName(column)
        );

        const cell = this.cells.get(key);

        if (value.trim() === "") {

            this.cells.delete(key);

            return;

        }

        this.cells.set(key, {
            ...cell, value
        });


    }

    public removeCell(
        row: number,
        column: number
    ): void {

        this.cells.delete(
            Helpers.getCellKey(row, Helpers.getColumnName(column))
        );

    }

    public setColor(
        row: number,
        column: number,
        value: string
    ){
        const cell = this.getCell(row, column);
        const key = Helpers.getCellKey(row, Helpers.getColumnName(column))

        if(!cell){

            this.cells.set(key, {value: "", backgroundColor: value});
        }

        this.cells.set(key, {...cell, backgroundColor: value});
    }

    public clear(): void {

        this.cells.clear();

    }

    public getAllCells(): Map<string, Cell> {

        return this.cells;

    }

    public loadRecords(
    records: Record<string, unknown>[]
): void {

    this.clear();

    if (records.length === 0) {
        return;
    }

    const headers = new Set<string>();

    for (const record of records) {

        Object.keys(record).forEach((key) => {

            headers.add(key);

        });

    }

    const columns = [...headers];

    // Header row
    columns.forEach((header, column) => {

        this.setCell(
            0,
            column,
            header
        );

    });

    // Data rows
    records.forEach((record, row) => {

        columns.forEach((header, column) => {

            const value = record[header];

            this.setCell(
                row + 1,
                column,
                value == null
                    ? ""
                    : String(value)
            );

        });

    });

}

    public importCells(cells: Record<string, Cell>):void{
        this.clear();
        for(const [key,value] of Object.entries(cells)){
            this.cells.set(key, value);
        }
    }

}