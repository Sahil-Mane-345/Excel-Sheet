import "./style.css";
import { Grid } from "./Grid/Grid";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<main>

    <h1>Excel Sheet</h1>

    <div>
        <label id="cell-input-label"></label>
        <input id="cell-input-bar" type="text">
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