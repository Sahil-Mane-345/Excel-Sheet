export class Helpers {

    public static getColumnName(column: number): string {

        let name = "";

        column++;

        while (column > 0) {

            const remainder = (column - 1) % 26;

            name =
                String.fromCharCode(65 + remainder) +
                name;

            column = Math.floor((column - 1) / 26);

        }

        return name;

    }

    public static getCellKey(
        row: number,
        column: string
    ): string {

        return `${row}:${column}`;

    }

}