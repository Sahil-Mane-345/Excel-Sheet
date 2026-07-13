import { DEFAULT_ROW_HEIGHT } from "../Utils/Constants";

export class Row {

    constructor(

        private index: number,

        private height: number = DEFAULT_ROW_HEIGHT

    ) {}

    public setHeight(height:number){
        if(height >= DEFAULT_ROW_HEIGHT){
            this.height = height;
        }
        return;
    }

    public getHeight(){
        return this.height;
    }

    public getIndex(){
        return this.index;
    }
}