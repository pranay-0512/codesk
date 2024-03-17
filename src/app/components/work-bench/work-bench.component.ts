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
  ngOnInit(): void {
    console.log("work bench component loaded");
  }
  onToolSelected(event: ToolSelectedEvent): void {
    console.log("onToolSelected called")
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
      localStorage.removeItem('canvas_state');
    }
    window.location.reload();
  }
}
export interface ToolSelectedEvent {
  selectedTool: CoCanvasTool; // Assuming CoCanvasTool is your tool type
}
