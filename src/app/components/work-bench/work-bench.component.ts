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
  updateShapeProperty(event: any): void {
    this.shapeProperties = { ...this.shapeProperties, ...event };
  }
  onShapePropertiesChange(event: any): void {
    this.shapeProperties = { ...this.shapeProperties, ...event };
  }
}
export interface ToolSelectedEvent {
  selectedTool: CoCanvasTool;
}
