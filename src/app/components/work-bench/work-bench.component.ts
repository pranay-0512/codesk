import { Component, OnInit } from '@angular/core';
import { InfiniteCanvasRenderingContext2D } from 'ef-infinite-canvas';
import { CoCanvasTool } from 'src/app/_models/work-bench/canvas/canvas-tool.model';

@Component({
  selector: 'app-work-bench',
  templateUrl: './work-bench.component.html',
  styleUrls: ['./work-bench.component.scss']
})
export class WorkBenchComponent implements OnInit {
  constructor() { }
  public selectedTool!: CoCanvasTool;
  public infCanvas!: HTMLCanvasElement;
  public ctx!: InfiniteCanvasRenderingContext2D;
  ngOnInit(): void {
    console.log("work bench component loaded");
  }
  onToolSelected(event: Event): void {
    this.selectedTool = event as unknown as CoCanvasTool;
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
