import type { Cell } from "../Model/Cell";
import { Helpers } from "../Utils/Helpers";

export class CellEditor {

    private cells = new Map<string, Cell>();

    public getCell(
        row: number,
        column: number
    ): Cell | undefined {

        return this.cells.get(
            Helpers.getCellKey(row, column)
        );

    }

    public setCell(
        row: number,
        column: number,
        value: string
    ): void {

        const key = Helpers.getCellKey(
            row,
            column
        );

        if (value.trim() === "") {

            this.cells.delete(key);

            return;

        }

        this.cells.set(key, {
            value
        });

    }

    public removeCell(
        row: number,
        column: number
    ): void {

        this.cells.delete(
            Helpers.getCellKey(row, column)
        );

    }

    public clear(): void {

        this.cells.clear();

    }

    public getAllCells(): Map<string, Cell> {

        return this.cells;

    }

    public loadJson(
        records: Record<string, unknown>[]
    ): void {

        this.clear();

        records.forEach((record, row) => {

            const values = Object.values(record);

            values.forEach((value, column) => {

                this.setCell(
                    row,
                    column,
                    String(value)
                );

            });

        });

    }

}