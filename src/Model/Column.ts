import { DEFAULT_COLUMN_WIDTH } from "../Utils/Constants";

export class Column {

    constructor(

        private index: string,

        private width: number = DEFAULT_COLUMN_WIDTH

    ) {}

    public setWidth(width:number){
        if(width >= DEFAULT_COLUMN_WIDTH){
            this.width = width;
        }
        return;
    }

    public getWidth(){
        return this.width;
    }

    public getIndex(){
        return this.index;
    }
}