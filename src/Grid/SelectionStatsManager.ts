import type { SelectionStats } from "../Model/SelectionStats";
import type { CellEditor } from "./CellEditor";
import type { Selection } from "./SelectionManager";

export class SelectionStatsManager {

    public calculate(
        selection: Selection,
        cellEditor: CellEditor
    ): SelectionStats {

        const startRow = Math.min(
            selection.startRow,
            selection.endRow
        );

        const endRow = Math.max(
            selection.startRow,
            selection.endRow
        );

        const startColumn = Math.min(
            selection.startColumn,
            selection.endColumn
        );

        const endColumn = Math.max(
            selection.startColumn,
            selection.endColumn
        );

        let cellCount = 0;
        let numericCount = 0;
        let sum = 0;
        let min = Infinity;
        let max = -Infinity;

        for (let row = startRow; row <= endRow; row++) {

            for (let column = startColumn; column <= endColumn; column++) {

                cellCount++;

                const cell = cellEditor.getCell(row, column);

                if (!cell) {
                    continue;
                }

                const value = Number(cell.value);

                if (Number.isNaN(value)) {
                    continue;
                }

                numericCount++;
                sum += value;

                min = Math.min(min, value);
                max = Math.max(max, value);

            }

        }

        return {
            cellCount,
            numericCount,
            sum,
            average: numericCount === 0 ? 0 : sum / numericCount,
            min: numericCount === 0 ? null : min,
            max: numericCount === 0 ? null : max
        };

    }

}