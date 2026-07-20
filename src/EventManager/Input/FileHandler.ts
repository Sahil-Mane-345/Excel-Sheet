import type { CellEditor } from "../../Grid/CellEditor";
import type { Renderer } from "../../Renderer/Renderer";

export class FileHandler {

    private fileInput: HTMLInputElement;

    constructor(
        private cellEditor: CellEditor,
        private renderer: Renderer
    ) {

        this.fileInput =
            document.getElementById(
                "file-input"
            ) as HTMLInputElement;

    }

    public register(): void {

        this.fileInput.addEventListener(
            "change",
            (e) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0];

                if (!file) {
                    console.warn("No file selected.");
                    return;
                }

                if (!file.name.toLowerCase().endsWith(".json")) {
                    alert("Please select a valid JSON file.");
                    target.value = "";
                    return;
                }

                const reader = new FileReader();

                reader.onload = () => {
                    try {
                        this.importSheet(reader.result as string);
                    } catch (err) {
                        alert("Invalid JSON format.");
                        console.error("JSON parse error:", err);
                    }
                };

                reader.onerror = () => {
                    alert("Error reading file.");
                    console.error("FileReader error:", reader.error);
                };

                reader.readAsText(file);
            }
        );

    }

    public exportSheet(): string {
        return JSON.stringify({
            cells: this.cellEditor.exportCells()
        });
    }

    public importSheet(json: string): void {
        const sheet = JSON.parse(json);
        this.cellEditor.loadRecords(sheet);
        this.renderer.render();
    }

}
