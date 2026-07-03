import { Sheet } from './Model/Sheet'
import './style.css'


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main>
    <h1>Excel Sheet</h1>
    <div>
      <label id="cell-input-label" for="cell-input-bar"></label> :
      <input type="text" id="cell-input-bar"/>
    </div>
   
    <div id="sheet-container">
    <canvas id="sheet-canvas">
    </canvas>
    <div id="scroll-space"></div>
    </div>
  </main>
`



const canvas : HTMLCanvasElement = document.getElementById("sheet-canvas") as HTMLCanvasElement;

const sheet = new Sheet(canvas);
