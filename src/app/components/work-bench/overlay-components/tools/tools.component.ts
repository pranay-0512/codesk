import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CoCanvasTool, tools } from 'src/app/_models/work-bench/canvas/canvas-tool.model';
import { ToolSelectedEvent } from '../../work-bench.component';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {
  @Output() toolSelected = new EventEmitter<ToolSelectedEvent>();
  public tools: Array<CoCanvasTool> = tools;
  constructor() { }
  ngOnInit(): void {
  }

  selectTool(tool: CoCanvasTool): void {
    this.tools.forEach((t) => {
      t.is_active = t.enum === tool.enum ? true : false;
    });
    this.toolSelected.emit({ selectedTool: tool })
  }
}
