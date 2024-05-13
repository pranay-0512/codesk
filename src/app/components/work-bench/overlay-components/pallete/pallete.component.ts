import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { fabric } from 'fabric';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CoCanvasState } from 'src/app/_models/work-bench/canvas/canvas-state.model';
import { CoCanvasTool, tools } from 'src/app/_models/work-bench/canvas/canvas-tool.model';
import { PalleteService } from 'src/app/_services/pallete/pallete.service';

@Component({
  selector: 'app-pallete',
  templateUrl: './pallete.component.html',
  styleUrls: ['./pallete.component.scss']
})
export class PalleteComponent implements OnInit {
  @Input() selectedTool: CoCanvasTool = tools[0];
  public isCollapsed: boolean = true;
  public canvas_state: CoCanvasState = {
    showWelcomeScreen: false,
    theme: 'dark', 
    currentFillStyle: 'rgba(45, 45, 45, 0.05)',
    currentFontFamily: 0,
    currentFontSize: 48,
    currentOpacity: 1,
    currentRoughness: 1,
    currentStrokeColor: 'black',
    currentRoundness: 10,
    currentStrokeStyle: 'solid',
    currentStrokeWidth: 5,
    currentTextAlign: 'left',
    editingGroupId: null,
    activeTool: {
      type: 'SELECT',
      lastActiveTool: 'SELECT'
    },
    exportBackground: false,
    gridSize: 100,
    name: 'co_canvas',
    scrolledOutside: false,
    relativeScrollX: 0,
    relativeScrollY: 0,
    selectedElementIds: {
      selectedElementIds: []
    },
    previousSelectedElementId: {
      selectedElementId: {
        elementId: ''
      }
    },
    font_family: 'comic sans ms',
    fonts: ['Sevillana', 'Combo', 'Gaegu'],
    viewBackgroundColor: 'black',
    zoom: {
      value: 1,
      offsetX: 0,
      offsetY: 0
    }
  };
  @Input() shapeProperties: any = {
    backgroundColor: this.canvas_state.currentFillStyle,
    strokeWidth: this.canvas_state.currentStrokeWidth,
    strokeColor: this.canvas_state.currentStrokeColor,
    opacity: this.canvas_state.currentOpacity,
    blur: this.canvas_state.shadow?.blur || 0,
    offsetX: this.canvas_state.shadow?.offsetX || 0,
    offsetY: this.canvas_state.shadow?.offsetY || 0,
    shadowColor: this.canvas_state.shadow?.color || '#000000'
  }
  @Output() propertyChange: EventEmitter<any> = new EventEmitter();
  public isToolSelected: boolean = false;
  public backgroundColor: string = this.canvas_state.currentFillStyle;
  public strokeWidth: number = this.canvas_state.currentStrokeWidth;
  public strokeColor: string = this.canvas_state.currentStrokeColor;
  public opacity: number = this.canvas_state.currentOpacity;
  public blur: number = this.canvas_state.shadow?.blur || 0;
  public offsetX: number = this.canvas_state.shadow?.offsetX || 0;
  public offsetY: number = this.canvas_state.shadow?.offsetY || 0;
  public shadowColor: string = this.canvas_state.shadow?.color || '#000000';
  public fabricCanvas: fabric.Canvas = new fabric.Canvas('co_canvas');
  private propertyChangeSubject = new Subject<any>();
  predefinedColors: string[] = ['#C8D96F', '#C6D8FF', '#FCF5C7', '#E6CCBE', '#F8F7FF']; // Predefined colors
  constructor(private palleteService: PalleteService) { 
    this.propertyChangeSubject.pipe(debounceTime(50000), distinctUntilChanged()).subscribe((value) => {
      this.propertyChange.emit(value);
    });
  }
  ngOnInit(): void {
  }
  emitChangeEvent(): void {
    this.propertyChange.emit({
      backgroundColor: this.backgroundColor,
      strokeWidth: this.strokeWidth,
      strokeColor: this.strokeColor,
      opacity: this.opacity,
      blur: this.blur,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      shadowColor: this.shadowColor
    });
  }
  toggleCollapse(): void {
    if(this.palleteService.isCollapsed) {
      this.palleteService.togglePalleteOpen();
    }
    else {
      this.palleteService.togglePalleteClose();
    }
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
    if(changes['shapeProperties']) {
      this.backgroundColor = this.shapeProperties.backgroundColor;
      this.strokeWidth = this.shapeProperties.strokeWidth;
      this.strokeColor = this.shapeProperties.strokeColor;
      this.opacity = this.shapeProperties.opacity;
      this.blur = this.shapeProperties.blur;
      this.offsetX = this.shapeProperties.offsetX;
      this.offsetY = this.shapeProperties.offsetY;
      this.shadowColor = this.shapeProperties.shadowColor;
    }
  }
}
