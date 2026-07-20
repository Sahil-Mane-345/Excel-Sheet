import { CommandManager } from "../../Commands/CommandManager";

export interface IGridCommand {
    execute(): void;
    undo(): void;
}

export class UndoRedoHandler {

    private commandManager = new CommandManager();

    public executeCommand(command: IGridCommand): void {
        this.commandManager.executeCommand(command);
    }

    public undo(): void {
        this.commandManager.undo();
    }

    public redo(): void {
        this.commandManager.redo();
    }

}
