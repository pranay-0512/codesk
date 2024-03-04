import { Component, OnInit } from '@angular/core';
import { CoCanvasTool } from 'src/app/_models/work-bench/canvas/canvas-tool.model';

@Component({
  selector: 'app-work-bench',
  templateUrl: './work-bench.component.html',
  styleUrls: ['./work-bench.component.scss']
})
export class WorkBenchComponent implements OnInit {
  constructor() { }
  public selectedTool!: CoCanvasTool;
  ngOnInit(): void {
    console.log("work bench component loaded");
  }
  onToolSelected(event: Event): void {
    this.selectedTool = event as unknown as CoCanvasTool;
  }
  clearCanvas(): void {
    const canvas = document.getElementById('co_canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      localStorage.removeItem('shapes');
    }
  }
}
