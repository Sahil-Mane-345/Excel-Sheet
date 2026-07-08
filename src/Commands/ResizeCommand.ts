import type { Command } from "./Command";


export class ResizeCommand implements Command {

    private previousSize: number;

    constructor(
        private getter: (index: number) => number,
        private setter: (index: number, size: number) => void,
        private index: number,
        private newSize: number
    ) {

        this.previousSize = this.getter(this.index);

    }

    public execute(): void {

        this.setter(
            this.index,
            this.newSize
        );

    }

    public undo(): void {

        this.setter(
            this.index,
            this.previousSize
        );

    }

}