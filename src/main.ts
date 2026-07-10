import "./style.css";
import { Grid } from "./Grid/Grid";


document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<main>

    <h1>Excel Sheet</h1>

    <div style="display:flex;">
        <div>
            <label id="cell-input-label"></label>
            <input id="cell-input-bar" type="text">
        </div>
        <div>
            <label id="file-input-label">Enter File in Json to be loaded : </label>
            <input id="file-input" type="file" accept=".json">
        </div>
        
    </div>

    <div id="sheet-container">

        <canvas id="sheet-canvas"></canvas>

        <div id="scroll-space"></div>

    </div>

</main>
`;

const canvas = document.getElementById("sheet-canvas") as HTMLCanvasElement;

const grid = new Grid(canvas);

grid.initialise();

