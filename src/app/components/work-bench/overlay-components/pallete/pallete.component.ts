import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CoCanvasTool, tools } from 'src/app/_models/work-bench/canvas/canvas-tool.model';

@Component({
  selector: 'app-pallete',
  templateUrl: './pallete.component.html',
  styleUrls: ['./pallete.component.scss']
})
export class PalleteComponent implements OnInit {
  @Input() selectedTool: CoCanvasTool = tools[0];
  @Output() propertyChange: EventEmitter<any> = new EventEmitter();
  public isToolSelected: boolean = false;
  public backgroundColor: string = '#ffffff';
  public strokeWidth: number = 1;
  public strokeColor: string = '#000000';
  public strokeStyle: string = 'solid';
  public opacity: number = 1;
  public blur: number = 0;
  public offsetX: number = 0;
  public offsetY: number = 0;
  public shadowColor: string = '#000000';
  constructor() { }

  ngOnInit(): void {
  }
  emitChangeEvent(): void {
    this.propertyChange.emit({
      backgroundColor: this.backgroundColor,
      strokeWidth: this.strokeWidth,
      strokeColor: this.strokeColor,
      strokeStyle: this.strokeStyle,
      opacity: this.opacity,
      blur: this.blur,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      shadowColor: this.shadowColor
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes['selectedTool']) {
      switch(this.selectedTool.enum) {
        case 'SELECT':
          this.isToolSelected = true;
          break;
        case 'PAN':
          this.isToolSelected = false;
          break;
        case 'ERASER':
          this.isToolSelected = false;
          break;
        default:
          this.isToolSelected = true;
          break;
      }
    }
  }
}
