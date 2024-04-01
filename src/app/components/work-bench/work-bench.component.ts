import { Component, OnInit } from '@angular/core';
import { InfiniteCanvasRenderingContext2D } from 'ef-infinite-canvas';
import { CoCanvasTool, tools } from 'src/app/_models/work-bench/canvas/canvas-tool.model';

@Component({
  selector: 'app-work-bench',
  templateUrl: './work-bench.component.html',
  styleUrls: ['./work-bench.component.scss']
})
export class WorkBenchComponent implements OnInit {
  constructor() { }
  public selectedTool: CoCanvasTool = tools[0];
  public infCanvas!: HTMLCanvasElement;
  public ctx!: InfiniteCanvasRenderingContext2D;
  public shapeProperties: any = {
    backgroundColor: '#ffffff',
    strokeWidth: 1,
    strokeColor: '#000000',
    opacity: 1,
    blur: 0,
    offsetX: 0,
    offsetY: 0,
    shadowColor: '#000000'
  };
  ngOnInit(): void {
  }
  onToolSelected(event: ToolSelectedEvent): void {
    this.selectedTool = event.selectedTool;
  }
  clearCanvas(): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    if(canvas) {
      this.infCanvas = canvas;
      this.ctx = this.infCanvas.getContext('2d') as InfiniteCanvasRenderingContext2D;
    }
    if (this.ctx) {
      this.ctx.clearRect(0, 0, Infinity, Infinity);
      localStorage.removeItem('cocanvas_shapes');
      localStorage.removeItem('cocanvas_state');
    }
    window.location.reload();
  }
  uploadCanvas(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.cocanvas';
    input.click();
    input.addEventListener('change', async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      const text = await file?.text();
      const { shapes, canvasState } = JSON.parse(text as string);
      localStorage.setItem('cocanvas_shapes', JSON.stringify(shapes));
      // localStorage.setItem('cocanvas_state', JSON.stringify(canvasState));
      window.location.reload();
    });
  }
  downloadCanvas(): void {
    const shapes = JSON.parse(localStorage.getItem('cocanvas_shapes') as string);
    const canvasState = JSON.parse(localStorage.getItem('cocanvas_state') as string);
    if(!shapes || !shapes.objects) return;
    const blob = new Blob([JSON.stringify({shapes, canvasState})], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const name = prompt('Enter file name', 'canvas');
    a.download = name ? `${name}.cocanvas` : 'canvas.cocanvas';
    a.click();
    URL.revokeObjectURL(url);
  }
  updateShapeProperty(event: any): void {
    this.shapeProperties = { ...this.shapeProperties, ...event };
    console.log(this.shapeProperties)
  }
  onShapePropertiesChange(event: any): void {
    this.shapeProperties = { ...this.shapeProperties, ...event };
  }
}
export interface ToolSelectedEvent {
  selectedTool: CoCanvasTool; // Assuming CoCanvasTool is your tool type
}
