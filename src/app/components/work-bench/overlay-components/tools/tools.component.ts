import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {
  @Output() selectedTool = new EventEmitter<string>();
  constructor() { }
  ngOnInit(): void {
  }
  
  selectTool(tool: string): void {
    console.log(tool)
    // emit selected tool event
    this.selectedTool.emit(tool);
  }
}
