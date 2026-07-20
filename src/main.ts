import "./style.css";
import { Grid } from "./Grid/Grid";

const canvas = document.getElementById("sheet-canvas") as HTMLCanvasElement;

const grid = new Grid(canvas);

grid.initialise();

