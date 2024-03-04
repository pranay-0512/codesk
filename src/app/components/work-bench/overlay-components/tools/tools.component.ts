import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CoCanvasTool, tools } from 'src/app/_models/work-bench/canvas/canvas-tool.model';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {
  @Output() selectedTool = new EventEmitter<CoCanvasTool>();
  public tools: Array<CoCanvasTool> = tools;
  constructor() { }
  ngOnInit(): void {
  }

  selectTool(tool: CoCanvasTool): void {
    this.tools.forEach((t) => {
      t.is_active = t.enum === tool.enum ? true : false;
    });
    this.selectedTool.emit(tool);
  }
}
