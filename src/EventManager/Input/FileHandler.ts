import type { CellEditor } from "../../Grid/CellEditor";
import type { Renderer } from "../../Renderer/Renderer";

export class FileHandler {

    private fileInput: HTMLInputElement;

    private exportButton: HTMLButtonElement;

    constructor(
        private cellEditor: CellEditor,
        private renderer: Renderer
    ) {

        this.fileInput = document.getElementById("file-input") as HTMLInputElement;

        this.exportButton = document.getElementById("export-sheet") as HTMLButtonElement;

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
                console.log(file.name);
                console.log(file.name.toLowerCase().endsWith(".json"));
                console.log(file.name.toLowerCase().endsWith(".sheet"));

                if (!file.name.toLowerCase().endsWith(".json") && !file.name.toLowerCase().endsWith(".sheet")) {
                    alert("Please select a valid JSON/sheet file.");
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

        this.exportButton.addEventListener("click", () => this.exportSheet());

    }

    public importSheet(json: string): void {
        const sheet = JSON.parse(json);
        if(Array.isArray(sheet)){
            this.cellEditor.loadRecords(sheet);
        }else if(
            typeof sheet === "object" && sheet!== null && sheet.type === "sheet" && typeof sheet.cells === "object" 
        ){
            this.cellEditor.importCells(sheet.cells);
        }
        this.renderer.render();
    }

    public exportSheet(): void {
        const sheet = {
            type: "sheet",
            version: 1,
            cells: Object.fromEntries(this.cellEditor.getAllCells())
        };

        const json = JSON.stringify(sheet, null, 2);

        const blob = new Blob([json], {
            type: "applicaion/json"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${Date.now()}.sheet`;
        link.classList = "hidden";
        
        link.click();
        document.body.appendChild(link);
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }

}
